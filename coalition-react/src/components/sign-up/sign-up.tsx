import React, { useState, useEffect, useCallback } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import styled from 'styled-components';
import axios, { AxiosResponse } from 'axios';
import { findClosestAgency } from './closest-agency-finder';

interface ICreateUserProps {
    changeTab: (active: number) => void;
}

interface IAgency {
    id: number;
    title: string;
    domain: string;
    agency_address: string;
}

interface IDomain {
    id: number;
    domain: string;
}

const StyledInformation = styled.div`
    padding: 20px;
    border: 1px solid #aaa;
    text-align: left;
    background-color:#eee;
`;

const StyledContainer = styled.div`
    padding:30px;
`;

const StyledWarning = styled.div`
    padding:20px;
    border: 1px solid #aaa;
    background-color: orange;
`;

const StyledWarningEmail = styled.div`
    padding:20px;
    border: 1px solid #aaa;
    background-color: red;
    color: white;
`;

const SignUp = (props: ICreateUserProps) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [signuptried, setSignuptried] = useState(false);
    const [fieldsWarning, setFieldsWarning] = useState('');
    const [emailWarning, setEmailWarning] = useState('');
    const [domainWhiteList, setDomainWhiteList] = useState({} as AxiosResponse<IDomain[]>);
    const [agencyData, setAgencyData] = useState({} as AxiosResponse<IAgency[]>);

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/domain-whitelist").then((data) => {
            setDomainWhiteList(data);
        });

        axios.get("http://127.0.0.1:5000/agency").then((data) => {
            setAgencyData(data);
        });

    }, [props]);


    const resetWarnings = () => {
        setFieldsWarning('');
        setEmailWarning('');
    }

    const validateFields = useCallback(() => {
        let isValid = true;
        resetWarnings();
        [firstname, lastname, email, address].forEach(
            (each) => {
                if (!each || each === '') {
                    isValid = false;
                    setFieldsWarning('Please make sure you filled all fields');
                }
            }
        );

        if (!isValid) return isValid;

        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
            isValid = false;
            setEmailWarning('Please enter a valid email address');
            return isValid;
        }

        return isValid;
    }, [firstname, lastname, email, address]);

    const validateDomain = () => {
        let isValid = false;
        let domain = email.split("@")[1];
        domainWhiteList.data.forEach((each: IDomain) => {
            if (each.domain === domain) {
                isValid = true;
            }
        });

        return isValid;
    }

    const assingAgencyId = () => {
        let domain = email.split("@")[1];
        let agencyId = -10;
        for (let i = 0; i < agencyData.data.length; i++) {
            if (agencyData.data[i].domain === domain) {
                agencyId = agencyData.data[i].id;
                break;
            }
        }
        return agencyId;
    }

    const isAgencyAssigned = (agencyId: number) => {
        return agencyId && agencyId !== -10;
    }

    const handleClick = async () => {
        setSignuptried(true);
        if (validateFields()) {
            if (validateDomain()) {
                let agencyId = assingAgencyId();
                if (!isAgencyAssigned(agencyId)) {
                    agencyId = Number(await findClosestAgency(address, agencyData));
                }
                const headers = {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                };
                axios.post("http://127.0.0.1:5000/broker", JSON.stringify({
                    variables: {
                        agency_id: agencyId,
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        broker_address: address
                    }
                }), { headers }).then((response) => {
                    if (!response.data.error) {
                        props.changeTab(1);
                    } else {
                        setFieldsWarning(response.data.error);
                    }
                });
            } else {
                setFieldsWarning("This domain is not in white list");
            }
        }
    }

    useEffect(() => { signuptried && validateFields() }, [signuptried, validateFields])

    const handleChangeFirstname = (e: any) => {
        setFirstname(e.target.value);
    }

    const handleChangeLastname = (e: any) => {
        setLastname(e.target.value);
    }

    const handleChangeEmail = (e: any) => {
        setEmail(e.target.value);
    }

    const handleChangeAddress = (e: any) => {
        setAddress(e.target.value);
    }


    return (
        <div>
            <React.Fragment>
                <StyledContainer>
                    <Grid container spacing={3}>
                        <Grid item md={12}>
                            {(fieldsWarning && fieldsWarning !== '') ? <StyledWarning>{fieldsWarning}</StyledWarning> :
                                ((emailWarning && emailWarning !== '') ? <StyledWarningEmail>{emailWarning}</StyledWarningEmail> :
                                    (signuptried ? <StyledInformation>Form is valid</StyledInformation> : <StyledInformation>Please fill the form below to sign up</StyledInformation>)
                                )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField onChange={handleChangeFirstname} required id="firstname" label="Firstname" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField onChange={handleChangeLastname} required id="lastname" label="Lastname" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                onChange={handleChangeEmail}
                                required
                                id="email"
                                label="Email"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                onChange={handleChangeAddress}
                                required
                                id="address"
                                label="Address"
                                helperText="Enter your address as one line"
                                fullWidth
                            />
                        </Grid>
                        <Grid container item xs={12} justify="flex-end">
                            <Button variant="contained" color="primary" onClick={handleClick}>
                                Sign Up
                            </Button>
                        </Grid>
                    </Grid>
                </StyledContainer>
            </React.Fragment>
        </div>
    );
}

export default SignUp;
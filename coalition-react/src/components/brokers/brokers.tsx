import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Grid, Box } from '@material-ui/core';
import styled from 'styled-components';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';

interface IBroker {
    id: number;
    agency_id: number;
    firstname: string;
    lastname: string;
    email: string;
    broker_address: string;
}

const StyledContainer = styled.div`
    padding:30px;
`;

const StyledGrid = styled(Grid)`
    padding: 2px;
    background: #eee;
    border-bottom: 4px solid black;
`;

const StyledBold = styled.span`
    font-weight:bold;
`;

const StyledInformation = styled.div`
    padding: 20px;
    border: 1px solid #aaa;
    text-align: left;
    background-color:#eee;
`;

const StyledContent = styled(Box)`
    text-align:left;
    width:100%;
    overflow: auto;
`;

const StyledContentButton = styled(Box)`
    &&&{
        cursor:pointer;
    }  
`;

const Brokers = () => {
    const [brokerData, setBrokerData] = useState({} as AxiosResponse<IBroker[]>);

    const fetchBrokers = () => {
        axios.get("http://127.0.0.1:5000/broker").then((data) => {
            setBrokerData(data);
        });
    }

    useEffect(() => {
        fetchBrokers();
    }, []);

    const handleDeleteClick = (id: number) => {
        axios.delete("http://127.0.0.1:5000/broker/" + id).then((data) => {
            fetchBrokers();
        });
    }

    const renderData = () => {
        return (
            <React.Fragment>

                <StyledGrid container spacing={3} alignItems="flex-start" direction="row" justify="flex-start">
                    <React.Fragment>
                        <Grid item xs={12}><StyledInformation>Signed in brokers are listed on the following table, if you want to delete one of the brokers you can use the delete buttons which are positioned on the end of each row.</StyledInformation></Grid>
                        <Grid item xs={2}><StyledBold><StyledContent>Firstname</StyledContent></StyledBold></Grid>
                        <Grid item xs={2}><StyledBold><StyledContent>Lastname</StyledContent></StyledBold></Grid>
                        <Grid item xs={3}><StyledBold><StyledContent>Email</StyledContent></StyledBold></Grid>
                        <Grid item xs={3}><StyledBold><StyledContent>Address</StyledContent></StyledBold></Grid>
                        <Grid item xs={1}><StyledBold><StyledContent>Agency Id</StyledContent></StyledBold></Grid>
                        <Grid item xs={1}></Grid>
                    </React.Fragment>
                </StyledGrid>
                {
                    (brokerData && brokerData.data) ?
                        brokerData.data.map((each: IBroker, i: number) =>
                            <StyledGrid key={i} container alignItems="flex-start" direction="row" spacing={3} justify="flex-start">
                                <Grid item xs={2}><StyledContent>{each.firstname}</StyledContent></Grid>
                                <Grid item xs={2}><StyledContent>{each.lastname}</StyledContent></Grid>
                                <Grid item xs={3}><StyledContent>{each.email}</StyledContent></Grid>
                                <Grid item xs={3}><StyledContent>{each.broker_address}</StyledContent></Grid>
                                <Grid item xs={1}><StyledContent>{each.agency_id}</StyledContent></Grid>
                                <Grid item xs={1}><StyledContentButton title="delete" onClick={() => handleDeleteClick(each.id)}><DeleteForeverRoundedIcon /></StyledContentButton></Grid>
                            </StyledGrid>
                        ) : <span></span>
                }
            </React.Fragment >
        )
    }


    return (
        <StyledContainer>
            {renderData()}
        </StyledContainer>
    );
}

export default Brokers;
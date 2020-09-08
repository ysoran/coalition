from flask import Flask, render_template, request, jsonify
from flask_cors import CORS, cross_origin
import yaml
from flask_sqlalchemy import SQLAlchemy
from psycopg2.errors import UniqueViolation
from sqlalchemy.exc import IntegrityError

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app, resources=r'/*', headers='Content-Type')
db_config = yaml.load(open('database.yaml'))
app.config['SQLALCHEMY_DATABASE_URI'] = db_config['uri'] 
db = SQLAlchemy(app)


class BadRequest(Exception):
    pass

class DomainWhitelist(db.Model):
    __tablename__ = "agency_domain_whitelist"
    id = db.Column(db.Integer, primary_key=True)
    domain = db.Column(db.String(255))
    def __init__(self, domain):
        self.domain = domain
    
    def __repr__(self):
        return '%s/%s' % (self.id, self.domain)

class Agency(db.Model):
    __tablename__ = "agencies"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    domain = db.Column(db.String(255))
    agency_address = db.Column(db.Text)
    
    def __init__(self, title, domain, agency_address):
        self.title = title
        self.domain = domain
        self.agency_address = agency_address
    
    def __repr__(self):
        return '%s/%s/%s/%s' % (self.id, self.title, self.domain, self.agency_address)

class Broker(db.Model):
    __tablename__ = "brokers"
    id = db.Column(db.Integer, primary_key=True)
    agency_id = db.Column(db.String(255))
    firstname = db.Column(db.String(255))
    lastname = db.Column(db.String(255))
    email = db.Column(db.String(255))
    broker_address = db.Column(db.Text)
    
    def __init__(self, agency_id, firstname, lastname, email, broker_address):
        self.agency_id = agency_id
        self.firstname = firstname
        self.lastname = lastname
        self.email = email
        self.broker_address = broker_address

    
    def __repr__(self):
        return '%s/%s/%s/%s/%s/%s' % (self.id, self.agency_id, self.firstname, self.lastname, self.email, self.broker_address)

@app.route('/agency', methods=['GET'])
def agency():
    if request.method == 'GET':
        data = Agency.query.order_by(Agency.id).all()
        dataJson = []
        for i in range(len(data)):
            dataDict = {
                'id': str(data[i]).split('/')[0],
                'title': str(data[i]).split('/')[1],
                'domain': str(data[i]).split('/')[2],
                'agency_address': str(data[i]).split('/')[3]
            }
            dataJson.append(dataDict)
        return jsonify(dataJson)

@app.route('/domain-whitelist', methods=['GET'])
def domainWhitelist():
    if request.method == 'GET':
        data = DomainWhitelist.query.order_by(DomainWhitelist.id).all()
        dataJson = []
        for i in range(len(data)):
            dataDict = {
                'id': str(data[i]).split('/')[0],
                'domain': str(data[i]).split('/')[1]
            }
            dataJson.append(dataDict)
        return jsonify(dataJson)


@app.route('/broker', methods=['POST', 'GET'])
def data():

    if request.method == 'POST':
        query = request.json
        body = query['variables']
        agency_id = body['agency_id']
        firstname = body['firstname']
        lastname = body['lastname']
        email = body['email']
        broker_address = body['broker_address']

        data = Broker(agency_id, firstname, lastname, email, broker_address)
        db.session.add(data)
        try:
            db.session.commit()
        except IntegrityError as e:
            return jsonify({
                'error': 'This email is already registered to the system!',
            })
        
        return jsonify({
            'status': 'Broker is registered to the db!',
            'firstname': firstname,
            'lastname': lastname,
            'email': email,
            'broker_address': broker_address
        })
    

    if request.method == 'GET':
        data = Broker.query.order_by(Broker.id).all()
        dataJson = []
        for i in range(len(data)):
            dataDict = {
                'id': str(data[i]).split('/')[0],
                'agency_id': str(data[i]).split('/')[1],
                'firstname': str(data[i]).split('/')[2],
                'lastname': str(data[i]).split('/')[3],
                'email': str(data[i]).split('/')[4],
                'broker_address': str(data[i]).split('/')[5]
            }
            dataJson.append(dataDict)
        return jsonify(dataJson)

@app.route('/broker/<string:id>', methods=['GET', 'DELETE', 'PUT'])
def onedata(id):

    if request.method == 'GET':
        data = Broker.query.get(id)
        dataDict = {
            'id': str(data).split('/')[0],
            'agency_id': str(data[i]).split('/')[1],
            'firstname': str(data[i]).split('/')[2],
            'lastname': str(data[i]).split('/')[3],
            'email': str(data[i]).split('/')[4],
            'broker_address': str(data[i]).split('/')[5]
        }
        return jsonify(dataDict)
        
    if request.method == 'DELETE':
        delData = Broker.query.filter_by(id=id).first()
        db.session.delete(delData)
        db.session.commit()
        return jsonify({'status': 'Broker '+id+' is deleted!'})

    if request.method == 'PUT':
        query = request.json
        body = query['variables']
        newAgency_id = body['agency_id']
        newFirstname = body['firstname']
        newLastname = body['lastname']
        newEmail = body['email']
        newBrokerAddress = body['broker_address']

        editData = Broker.query.filter_by(id=id).first()
        editData.agency_id = newAgency_id
        editData.firstname = newFirstname
        editData.lastname = newLastname
        editData.email = newEmail
        editData.broker_address = newBrokerAddress

        db.session.commit()
        return jsonify({'status': 'Broker '+id+' is updated!'})

if __name__ == '__main__':
    app.debug = True
    app.run()
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


df = pd.read_json('orbit-viewer/PSCompPars_2024.09.30_17.09.44.json', lines=True)

@app.route('/api/hostname-or-planet', methods=['GET'])
def get_hostname_or_planet_data():
    hostname = request.args.get('hostname', None)
    plname = request.args.get('plname', None)

    if hostname:
        look = df.loc[df['hostname'] == hostname]
    elif plname:
        look = df.loc[df['pl_name'] == plname]
    else:
        return jsonify({"error": "No hostname or planet name provided"}), 400  

    if look.empty:
        return jsonify({"error": "Hostname or planet name not found"}), 404

    solar_system_data = look[[  
        'hostname',
        'pl_name',         
        'pl_orbsmax',      
        'pl_orbper',       
        'pl_rade',         
        'pl_bmasse',       
        'pl_orbeccen',     
        'pl_eqt'           
    ]].reset_index(drop=True)

    solar_system_data = solar_system_data.fillna("data not found")

    return jsonify(solar_system_data.to_dict(orient='records'))


@app.route('/api/hostnames', methods=['GET'])
def get_all_hostnames():
    hostnames = df['hostname'].unique().tolist()
    return jsonify(hostnames)

@app.route('/api/solar-system-data', methods=['GET'])
def get_solar_system_data():
    solar_system_data = df[[
        'hostname',
        'pl_name',         
        'pl_orbsmax',      
        'pl_orbper',       
        'pl_rade',         
        'pl_bmasse',       
        'pl_orbeccen',     
        'pl_eqt'           
    ]].reset_index(drop=True) 

    solar_system_data = solar_system_data.fillna("data not found")

    return jsonify(solar_system_data.to_dict(orient='records'))

@app.route('/api/solar-system/<string:hostname>', methods=['GET'])
def get_solar_system_data_by_hostname(hostname):

    look = df.loc[df['hostname'] == hostname]

    if look.empty:
        return jsonify({"error": "Hostname not found"}), 404


    solar_system_data = look[[
        'hostname',
        'pl_name',         
        'pl_orbsmax',      
        'pl_orbper',       
        'pl_rade',         
        'pl_bmasse',       
        'pl_orbeccen',     
        'pl_eqt'           
    ]].reset_index(drop=True)

    solar_system_data = solar_system_data.fillna("data not found")

    return jsonify(solar_system_data.to_dict(orient='records'))



if __name__ == '__main__':
    app.run(debug=True)

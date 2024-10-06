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
        'pl_eqt',
        'st_teff'           
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
        'pl_eqt',
        'st_teff'           
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
        'pl_eqt',
        'st_teff'           
    ]].reset_index(drop=True)

    solar_system_data = solar_system_data.fillna("data not found")

    return jsonify(solar_system_data.to_dict(orient='records'))

@app.route('/api/planet-data/<string:pl_name>', methods=['GET'])
def get_planet_data_by_name(pl_name):
    look = df.loc[df['pl_name'] == pl_name]

    if look.empty:
        return jsonify({"error": "Planet not found"}), 404

    column_order = [
        'pl_name',          # Planet name
        'hostname',         # Host star name
        'sy_snum',          # Number of stars in the system
        'sy_pnum',          # Number of planets in the system
        'discoverymethod',  # Discovery method
        'disc_year',        # Year of discovery
        'pl_orbsmax',       # Orbital semi-major axis
        'pl_orbper',        # Orbital period
        'pl_rade',          # Planet radius
        'pl_bmasse',        # Planet mass
        'pl_orbeccen',      # Orbital eccentricity
        'pl_eqt',           # Equilibrium temperature
        'st_teff',          # Stellar effective temperature
        'st_mass',          # Stellar mass
        'st_rad',           # Stellar radius
        'sy_dist'           # Distance to the system
    ]
    planet_data = look[column_order].reset_index(drop=True)

    planet_data = planet_data.fillna("data not found")

    result = planet_data.to_dict(orient='records')

    from collections import OrderedDict
    ordered_result = [OrderedDict((key, item[key]) for key in column_order) for item in result]

    return jsonify(ordered_result)





if __name__ == '__main__':
    app.run(debug=True)

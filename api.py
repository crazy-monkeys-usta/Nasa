import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

df = pd.read_json('orbit-viewer/PSCompPars_2024.09.30_17.09.44.json', lines=True)


@app.route('/api/hostname/<string:hostname>', methods=['GET'])
def get_hostname_data(hostname):

    look = df.loc[df['hostname'] == hostname]
    if look.empty:
        return jsonify({"error": "Hostname not found"}), 404
    return jsonify(look.to_dict(orient='records'))

@app.route('/api/hostnames', methods=['GET'])
def get_all_hostnames():
  
    hostnames = df['hostname'].unique().tolist()  
    return jsonify(hostnames)

if __name__ == '__main__':
    app.run(debug=True)

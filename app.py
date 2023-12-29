from flask import Flask, render_template, request, jsonify
import json
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('test.html')

@app.route('/api/preguntas', methods=['POST'])
def procesar_pregunta():
    try:
        pregunta = request.json['pregunta']
        respuesta_azure = obtener_respuesta_azure(pregunta)

        return jsonify(respuesta_azure)

    except Exception as e:
        return jsonify({'error': str(e)})

def obtener_respuesta_azure(pregunta):
    url = "https://agencia-educacion-s.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=agencia-eduacion-talleres&api-version=2021-10-01&deploymentName=production"

    headers = {
        "Ocp-Apim-Subscription-Key": "PUT THE SECRET KEY HERE",
        "Content-Type": "application/json",
    }

    data = {
        'top': 3,
        'question': pregunta,
        'includeUnstructuredSources': True,
        'confidenceScoreThreshold': 0,
    }

    response = requests.post(url, headers=headers, json=data)
    return response.json()

if __name__ == '__main__':
    app.run(debug=True)

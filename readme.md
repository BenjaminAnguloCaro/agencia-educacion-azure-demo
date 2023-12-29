# Read me

This is a demo created with Azure for the development of a chatbot for the Agencia de Calidad de la Eduación.

## Instructions to use 

### Step 1 

In your Azure account go to Language Services and create a Standart (S) resource group. 

### Step 2

Go to the Edit Knowledge Base section and click on Import as TSV to import the file agencia-educacion-talleres_qnas.tsv located in the Azure Q&A folder.

### Step 3 

Go to Deploy knowledge base and click on Deploy. Then click on Get prediction URL and look for the Secret Key. It will look like this: 

Ocp-Apim-Subscription-Key: your_secret_key

When you have it, place it in app.py and test.js in the section that says "PUT THE SECRET KEY HERE".

### Step 4

To run the chatbot, activate the virtual enviroment and install the requirements from requirements.txt, and then type "python app.py" in the terminal. 
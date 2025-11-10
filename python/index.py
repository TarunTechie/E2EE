from typing import Union

from fastapi import FastAPI
from utils import generateKeyPairs, generateExchangeKey , decryptData , encryptData
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()


origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    cipherText:str
    tag:str
    initializationVector:str

class Key(BaseModel):
    publicKey:str
    
@app.get('/')
def hello():
    return {"msg":"hello from FASTAPI"}

@app.post('/publicKey')
def getKeys(key:Key):
    public_key=generateKeyPairs()
    generateExchangeKey(privateKey="a",publicKey=key.publicKey)
    return {"key":public_key}

@app.post('/sendMsg')
def getMessage(message:Message):
    decryptData("temp",message.cipherText,message.tag,message.initializationVector)
    return {"msg":"vanakam da mapilai"}

@app.get('/getData')
def getData(name:str,field:str):
    print(name)
    result=encryptData(name,"tes")
    return result
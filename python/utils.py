from cryptography.hazmat.primitives.asymmetric import x25519
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.ciphers import Cipher , algorithms, modes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes


import os
import base64
def generateHKDF(key):
    salt=b"added for taste"
    info=b"these are testkeys"
    exKey=base64.b64decode(key)
    hkdf=HKDF(algorithm=hashes.SHA256(),length=32,salt=salt,info=info)
    hdfkKey=hkdf.derive(exKey)
    print("This is the hdfkKey",base64.b64encode(hdfkKey).decode())
    return hdfkKey

def generateKeyPairs():
    #this generates keyPair objects to extract the keys from
    privateKey=x25519.X25519PrivateKey.generate()
    publicKey=privateKey.public_key()
    
    #this is to convert them to rawBytes to be used later
    priv_key=privateKey.private_bytes(encoding=serialization.Encoding.Raw,format=serialization.PrivateFormat.Raw,encryption_algorithm=serialization.NoEncryption())
    
    pub_key=publicKey.public_bytes(encoding=serialization.Encoding.Raw,format=serialization.PublicFormat.Raw)
    
    pubKey=base64.b64encode(pub_key)
    with open('private.key','wb') as f:
        f.write(priv_key)
    return pubKey
    
def generateExchangeKey(privateKey,publicKey):
    pubKey=base64.b64decode(publicKey)
    with open('private.key','rb') as f:
        privKey=f.read()
    
    prik=x25519.X25519PrivateKey.from_private_bytes(privKey)
    pubk=x25519.X25519PublicKey.from_public_bytes(pubKey)
    exchangeKey=prik.exchange(pubk)
    toWrite=base64.b64encode(exchangeKey)
    print(toWrite)
    with open('exchange.key','wb') as f:
        f.write(toWrite)

def encryptData(data,exKey):
    initialization_vector=os.urandom(12)
    with open ('exchange.key','rb') as f:
        exchangeKey=f.read()
    aes_key=generateHKDF(exchangeKey)
    encryptor=Cipher(algorithms.AES(aes_key),modes.GCM(initialization_vector)).encryptor()
    dataB=data.encode('utf-8')
    cypher=encryptor.update(dataB)+encryptor.finalize()
    return cypher,encryptor.tag,initialization_vector

def decryptData(exKey,cipherText,tag,initialization_vector):
    with open ('exchange.key','rb') as f:
        exchangeKey=f.read()
    aes_key=generateHKDF(exchangeKey)
    iv_bytes=base64.b64decode(initialization_vector)
    tag_bytes=base64.b64decode(tag)
    decryptor=Cipher(algorithms.AES(aes_key),modes.GCM(iv_bytes,tag_bytes)).decryptor()
    data=decryptor.update(base64.b64decode(cipherText))+decryptor.finalize()
    print(data)
    return data

# u1pri,u1pub=generateKeyPairs()
# u2pri,u2pub=generateKeyPairs()

# u1ex=generateExchangeKey(u1pri,u2pub)
# u2ex=generateExchangeKey(u2pri,u1pub)

# print(u1ex==u2ex)
# u1cipher,tag,initialization_vector=encryptData(input(),u1ex)
# data=decryptData(u1ex,u1cipher,tag,initialization_vector)

# print("This is the encrypted data", u1cipher)
# print("This is the orginal data", data)

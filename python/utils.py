from cryptography.hazmat.primitives.asymmetric import x25519
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.ciphers import Cipher , algorithms, modes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes


import os

def generateHKDF(key):
    salt=b"added for taste"
    info=b"these are testkeys"
    hkdf=HKDF(algorithm=hashes.SHA256(),length=32,salt=salt,info=info,)
    return hkdf.derive(key)

def generateKeyPairs():
    #this generates keyPair objects to extract the keys from
    privateKey=x25519.X25519PrivateKey.generate()
    publicKey=privateKey.public_key()
    
    #this is to convert them to rawBytes to be used later
    priv_key=privateKey.private_bytes(encoding=serialization.Encoding.Raw,format=serialization.PrivateFormat.Raw,encryption_algorithm=serialization.NoEncryption())
    
    pub_key=publicKey.public_bytes(encoding=serialization.Encoding.Raw,format=serialization.PublicFormat.Raw)
    
    with open('pubkey.key','wb') as f:
        f.write(pub_key)
    return priv_key,pub_key
    
def generateExchangeKey(privateKey,publicKey):
    prik=x25519.X25519PrivateKey.from_private_bytes(privateKey)
    pubk=x25519.X25519PublicKey.from_public_bytes(publicKey)
    exchangeKey=prik.exchange(pubk)
    return exchangeKey

def encryptData(data,exKey):
    initialization_vector=os.urandom(12)
    aes_key=generateHKDF(exKey)
    encryptor=Cipher(algorithms.AES(aes_key),modes.GCM(initialization_vector)).encryptor()
    dataB=data.encode('utf-8')
    cypher=encryptor.update(dataB)+encryptor.finalize()
    return cypher,encryptor.tag,initialization_vector

def decryptData(exKey,cipherText,tag,initialization_vector):
    aes_key=generateHKDF(exKey)
    decryptor=Cipher(algorithms.AES(aes_key),modes.GCM(initialization_vector,tag)).decryptor()
    data=decryptor.update(cipherText)+decryptor.finalize()
    return data

u1pri,u1pub=generateKeyPairs()
u2pri,u2pub=generateKeyPairs()

u1ex=generateExchangeKey(u1pri,u2pub)
u2ex=generateExchangeKey(u2pri,u1pub)

print(u1ex==u2ex)
u1cipher,tag,initialization_vector=encryptData(input(),u1ex)
data=decryptData(u1ex,u1cipher,tag,initialization_vector)

print("This is the encrypted data", u1cipher)
print("This is the orginal data", data)
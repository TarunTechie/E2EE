import sodium from "libsodium-wrappers"
import { Buffer } from 'buffer'

export async function initSodium()
{
    await sodium.ready
    return sodium
}

export async function generateHKDF(key) {
    initSodium()
    const salt = Buffer.from("added for taste")
    const info = Buffer.from("these are testkeys")

    const baseKey = await window.crypto.subtle.importKey("raw", key, { name: "HKDF" }, false, ['deriveKey', 'deriveBits'])

    const hkdfKey = await window.crypto.subtle.deriveKey(
        {
            name: 'HKDF',
            hash: "SHA-256",
            salt,
            info
        },baseKey,{name:"AES-GCM",length:256},true,['encrypt','decrypt']
    )
    
    console.log(Buffer.from(await crypto.subtle.exportKey("raw",hkdfKey)).toString('base64'))
    return hkdfKey
}

export async function generateKeyPair()
{
    await initSodium()
    const keyPair = sodium.crypto_box_keypair()
    localStorage.setItem("private_key",Buffer.from(keyPair.privateKey).toString('base64'))
    return Buffer.from(keyPair.publicKey).toString('base64')
}

export async function generateExchangeKey(privateKey, publicKey)
{
    await initSodium()
    const pubKey = Buffer.from(publicKey, 'base64')
    const priKey=Buffer.from(privateKey,'base64')
    const exchangeKey = sodium.crypto_scalarmult(priKey, pubKey)
    localStorage.setItem("exchange_key",Buffer.from(exchangeKey).toString('base64'))
    return exchangeKey
}

export async function encryptData(data, exkey)
{
    const exchangeKey = Buffer.from(localStorage.getItem("exchange_key"), 'base64')
    const msg = Buffer.from(data)
    const aes_key = await generateHKDF(exchangeKey)
    const initializationVector = window.crypto.getRandomValues(new Uint8Array(12))
    
    const cipher =await window.crypto.subtle.encrypt({
        name: "AES-GCM",
        iv: initializationVector,
        tagLength:128
    },aes_key,msg)
    
    const fullChipher = Buffer.from(cipher)
    const cipherText = fullChipher.slice(0, fullChipher.length - 16)
    const tag=fullChipher.slice(fullChipher.length-16)
    const result = {
        "cipherText": cipherText.toString('base64'),
        "tag": tag.toString('base64'),
        "initializationVector":Buffer.from(initializationVector).toString('base64')
    }
    return result
}

export async function decryptData(exKey,cipherText,tag,initializationVector)
{
    const aes_key = await generateHKDF(exKey)
    const dicipher = crypto.createDecipheriv('aes-256-gcm', aes_key, initializationVector)
    dicipher.setAuthTag(tag)
    let data = dicipher.update(cipherText,'hex' ,'utf-8')
    data += dicipher.final('utf-8')
    return data
}

// const u1= await generateKeyPair()
// const u2 = await generateKeyPair()


// const u1ex=await generateExchangeKey(u1.privateKey,u2.publicKey)
// const u2ex = await generateExchangeKey(u2.privateKey, u1.publicKey)

// console.log(Buffer.compare(u1ex, u2ex) === 0 ? true : false)

// const message = "Hello World"

// const encryptedData = await encryptData(message, u1ex)

// console.log(encryptedData)

// const decryptedData = await decryptData(u2ex, encryptedData.cipherText, encryptedData.tag, encryptedData.initializationVector)

// console.log(decryptedData)




import sodium from "libsodium-wrappers"
import crypto from 'node:crypto'
import fs from 'fs'

export async function initSodium()
{
    await sodium.ready
    return sodium
}

export async function generateHKDF(key) {
    const salt = Buffer.from('added for taste', 'utf-8')
    const info = Buffer.from('these are testkeys', 'utf-8')
    const exKey = Buffer.from(key)

    return new Promise((resolve, reject) => {
        crypto.hkdf('sha256', salt, exKey, info, 32, (err, derivedKey) => {
            if (err) reject(err)
            else return resolve(derivedKey)
        })
    })
}

export async function generateKeyPair()
{
    await initSodium()

    const keyPair = sodium.crypto_box_keypair()
    // fs.writeFileSync("public.key", Buffer.from(keyPair.publicKey));
    return keyPair
}

export async function generateExchangeKey(privateKey, publicKey)
{
    await initSodium()

    const exchangeKey = sodium.crypto_scalarmult(privateKey, publicKey)
    return exchangeKey
}

export async function encryptData(data, exkey)
{
    const aes_key = await generateHKDF(exkey)
    const initializationVector = crypto.randomBytes(12)
    const cipher = crypto.createCipheriv('aes-256-gcm',aes_key,initializationVector)
    let cipherText = cipher.update(data, 'utf-8', 'hex')
    cipherText += cipher.final()
    const tag = cipher.getAuthTag()
    
    const result = {
        "cipherText": cipherText,
        "tag": tag,
        "initializationVector":initializationVector
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

const u1=await generateKeyPair()
const u2 = await generateKeyPair()


const u1ex=await generateExchangeKey(u1.privateKey,u2.publicKey)
const u2ex = await generateExchangeKey(u2.privateKey, u1.publicKey)

console.log(Buffer.compare(u1ex, u2ex) === 0 ? true : false)

const message = "Hello World"

const encryptedData = await encryptData(message, u1ex)

console.log(encryptedData)

const decryptedData = await decryptData(u2ex, encryptedData.cipherText, encryptedData.tag, encryptedData.initializationVector)

console.log(decryptedData)
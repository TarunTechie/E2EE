# 🔐 Crypto Utils

A lightweight cross-language cryptography toolkit providing essential building blocks for **secure communication**, **key derivation**, and **encryption**.  
Implements **modern cryptographic algorithms** compatible between **Node.js** and **Python**, making it ideal for research, learning, or integration into end-to-end encrypted systems.

---

## 🚀 Overview

This repository contains a collection of **Python** and **JavaScript** utility functions for:

- Secure **key exchange**
- Symmetric key **derivation** using HKDF
- **AES-GCM** encryption and decryption
- **Cross-language** cryptographic interoperability

These utilities demonstrate how end-to-end encryption (E2EE) can be implemented using industry-standard primitives without exposing plaintext or derived keys to the server.

---

## ⚙️ Algorithms Used

| Algorithm | Purpose | Description |
|------------|----------|--------------|
| **Diffie–Hellman (ECDH / X25519)** | Key Exchange | Securely establishes a shared secret between two parties without transmitting private keys. |
| **HKDF (HMAC-based Key Derivation Function)** | Key Derivation | Derives strong symmetric keys from shared secrets using **HMAC-SHA256** as the underlying hash. |
| **AES-GCM (Advanced Encryption Standard – Galois/Counter Mode)** | Encryption | Authenticated encryption algorithm that ensures both confidentiality and integrity of messages. |
| **SHA-256** | Hashing | Used internally by HMAC and HKDF for cryptographic strength and key stretching. |
| **UTF-8 / Hex Encoding** | Encoding | UTF-8 converts text to binary data; Hex ensures consistent cross-platform encoding for derived keys and ciphertexts. |

---



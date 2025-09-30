// backend/verifyIdentity.js

const { ethers } = require('ethers');
const axios = require('axios');
require('dotenv').config();

// Farcaster Hub API'si (en güvenilir adres)
const HUB_API_URL = 'https://nemes.farcaster.xyz:2283/v1/userByFid'; 

// Base ağına bağlanmak için bir RPC URL'si
const BASE_RPC_URL = 'https://mainnet.base.org/'; 
const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);

// ENS Resolver sözleşmesinin adresi
const ENS_RESOLVER_ADDRESS = '0x00000000000C2E074eC69A0d5f992fcd19A8fFf3';
const ENS_ABI = [
  "function resolver(bytes32 node) view returns (address)"
];

// Ana doğrulama fonksiyonu
async function verifyIdentity(fid, ensName) {
    try {
        // 1. Adım: Farcaster Hub'dan kullanıcının FID'sini al
        const userResponse = await axios.get(`${HUB_API_URL}?fid=${fid}`);
        const farcasterUser = userResponse.data.user;
        
        console.log(`Farcaster kullanıcısı bulundu: ${farcasterUser.username}`);

        // 2. Adım: ENS adının çözümlendiği adresi bul
        const resolverContract = new ethers.Contract(ENS_RESOLVER_ADDRESS, ENS_ABI, provider);
        const node = ethers.dns.namehash(ensName);
        const resolvedAddress = await resolverContract.resolver(node);
        
        console.log(`ENS adı ${ensName} için çözümlenen adres: ${resolvedAddress}`);

        // 3. Adım: ENS adresinin Farcaster kullanıcısının sahibi olduğu bir adrese eşleştiğini doğrula
        // Bu kısım daha karmaşıktır ve Farcaster hesabının zincir üzerindeki adreslerini gerektirir.
        // Şimdilik sadece sembolik bir kontrol yapalım.
        const isVerified = (resolvedAddress.toLowerCase() === farcasterUser.verified_addresses[0].address.toLowerCase());
        
        if (isVerified) {
            console.log(`\nBaşarılı! ${farcasterUser.username} ve ${ensName} aynı kimliğe ait.`);
        } else {
            console.log(`\nDoğrulama başarısız. Kimlikler eşleşmiyor.`);
        }
        
        return isVerified;
        
    } catch (error) {
        console.error('Kimlik doğrulama sırasında bir hata oluştu:', error.message);
        return false;
    }
}

// Dışa aktarma
module.exports = verifyIdentity;
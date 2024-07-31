const request = require("./src/untils/request");

let accessToken = '';
let listData = [];
let adToken = '';
let maxNum = 0;

// 获取token
const getToken = async () => {
    const token = await request("POST", "https://maq.ddmaq.com/maq-user/login", {
        username: "15665834992",
        password: "987654321",
    });

    accessToken = token.data.accessToken;
};


const maqList = async () => {
    const list = await request('GET', "https://maq.ddmaq.com/maq-coins/manke/rentList", {}, {}, accessToken);
    listData = list.data;
}

const getAd = async () => {
    await request('POST', "https://maq.ddmaq.com/maq-ad/put/getAdvertising", { age: 18, sex: 1 }, {}, accessToken).then(res => {
        console.log('this is ad:', res);
        adToken = res.data.adToken;
    });
}

const get = () => {
    listData.map(async item => {
        await request('POST', "https://maq.ddmaq.com/maq-coins/manke/rent", {
            id: item.id,
            adToken: adToken,
        }, {}, accessToken).then(res => {
        })
    })
}

const getHasList = async () => {
    await request('GET', "https://maq.ddmaq.com/maq-power/income/getList", { page: 1, pageSize: 10, status: 0, begin: '2023-01-01 00:00', end: '2023-01-05 00:00' }, {}, accessToken).then(res => {
        console.log('this is hasList:', res);
    });
}

const getMaq = async () => {
    await getToken();
    await maqList();
    await getAd();
    await get();
    await getHasList();
}

module.exports = { getMaq };

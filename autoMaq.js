const request = require("./request");

// 收取token
const getMaq = async (params) => {
    console.log(params);
    // 获取token
    const accessToken = await request("POST", "https://maq.ddmaq.com/maq-user/login", params);
    // 获取列表
    const list = await maqList(accessToken.data.accessToken);
    // 获取广告token
    const adToken = await getAd(accessToken.data.accessToken);
    // 收取
    await get(list.data, adToken, accessToken);
};


const maqList = async (accessToken) => {
    const list = await request('GET', "https://maq.ddmaq.com/maq-coins/manke/rentList", {}, {}, accessToken);
    return list;
}

const getAd = async (accessToken) => {
    await request('POST', "https://maq.ddmaq.com/maq-ad/put/getAdvertising", { age: 18, sex: 1 }, {}, accessToken);
}

const get = (list, token, accessToken) => {
    list.map(async item => {
        await request('POST', "https://maq.ddmaq.com/maq-coins/manke/rent", {
            id: item.id,
            adToken: token,
        }, {}, accessToken)
    })
}

getMaq({
    username: "15665834992",
    password: "987654321",
})

getMaq({
    username: "15264086788",
    password: "12345678",
})

getMaq({
    username: "13583025988",
    password: "qwertyuiop",
})

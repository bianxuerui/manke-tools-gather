const axios = require("axios");

let accessToken = '';
let suanliDTO = 0;

const request = async (method, url, params = {}, headers = {}, token = '') => {
    try {
        // 如果是 GET 请求，将 params 转换为查询字符串并附加到 URL 中
        if (method.toUpperCase() === 'GET') {
            const queryString = new URLSearchParams(params).toString();
            url += `?${queryString}`;
        }

        const response = await axios({
            method,
            url,
            data: method.toUpperCase() !== 'GET' ? params : {}, // GET 请求不需要 data
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                clientId: 'manke-app', // 添加 clientId 到 headers
                deviceSystem: 'android',
                deviceName: 'vivo x21',
                deviceNo: 'AKDLJSLFJLDSKJFLKSD',
                accessToken: token,
                loginCity: '',
            },
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// 获取token
const getToken = async (params) => {
    const token = await request("POST", "https://maq.ddmaq.com/maq-user/login", params);
    console.log(token);
    accessToken = token.data.accessToken;
    console.log('this is token:', token.data.accessToken);
};

// 获取权重列表
const getMaxNum = async (params) => {
    const data = await request('GET', "https://maq.ddmaq.com/maq-power/hashratePackageOrder/getUserHashratePackageList", params, {}, accessToken)
    if (data?.data?.packageUserDTOS?.length) {
        suanliDTO = data?.data?.packageUserDTOS[0];
    }
}

// 购买权重包
const buySuanli = async () => {
    console.log(suanliDTO, 'ssssssssss');
    const result = await request('POST', "https://maq.ddmaq.com/maq-power/hashratePackageOrder/addHashratePackageOrder", {
        id: suanliDTO?.id,
        payType: 0,
        count: Number(suanliDTO?.purchaseTimeDaily) || 100,
        walletType: 4,
        orderAmount: suanliDTO?.money * Number(suanliDTO?.purchaseTimeDaily),
        password: 122222,
    }, {}, accessToken)

    request('GET', `https://bark.6yi.plus/gxPCWmEsJJTJFKSmeW5GUN/${result?.message}`);
    console.log('购买结果：', result);
}

const running = async () => {
    await getToken({
        username: "15665834992",
        password: "987654321",
    });
    await getMaxNum({ type: 0 });
    await buySuanli();
}

running(); 
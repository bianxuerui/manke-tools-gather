const axios = require("axios");

let accessToken = '';
let suanliDTO = 0;
const BASEURL = 'http://shop.ddmaq.com';

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
                token: token,
            },
        });

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
// 获取详情
const getDetail = async (params) => {
    const data = await request("GET", BASEURL + "/api/v4/auctionfq/detail", params, {}, accessToken);
    console.log('商品详情:', data);
    return data;
}

// 报名
const getQualification = async (params) => {
    const data = await request("POST", BASEURL + "/api/v4/auctionfq/paybzj", params, {}, accessToken);
    console.log('报名:', data);
}

// 出价
const getShop = async (params) => {
    const data = await request("GET", BASEURL + "/api/v4/auctionfq/bid", params, {}, accessToken);
    console.log('出价:', data);
    request('GET', `https://bark.6yi.plus/gxPCWmEsJJTJFKSmeW5GUN/${data?.data?.msg || '购买成功'}`);
}


const allFuc = async (id, token) => {
    accessToken = token;
    const detail = await getDetail({ id: id });
    await getQualification({ id: detail?.data?.auction?.act_id, paypwd: '122222' });
    await getShop({ id: detail?.data?.auction?.act_id, price_times: detail?.data?.auction?.end_price });
}

// 这里需要商品Id和token
allFuc(28863, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJhdWQiOiJodHRwczpcL1wvd3d3LmRzY21hbGwuY24iLCJzdWIiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiZXhwIjoxNzI1MDY4NzIzLCJ1c2VyX2lkIjo5Mjd9.1uoq8bqVs8nUfPqE2VQXLkIrLlay-2IxHtppgaY8KPA');
const axios = require('axios');
const defaults = require('../defaults');
const url = 'comprobantes';

const compRequest = {
    getComp: function(tipo){
        return axios({
            ...defaults,
            method: 'GET',
            url: `/api/${url}/${tipo}`
        });
    },
};

module.exports = compRequest;
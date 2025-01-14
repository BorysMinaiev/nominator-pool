const {funcer} = require("./funcer");
const {
    FC, VALIDATOR_ADDR, ELECTOR_ADDR, ANYBODY_ADDR, NOMINATOR_1_ADDR, NOMINATOR_2_ADDR, makeNominator, makeStorage,
    TON, CONFIG_PARAMS
} = require("./utils");

const storage = (validator_amount) => {
    return makeStorage({
        state: 0,
        validator_amount,
        config: {
            validator_address: '0x' + VALIDATOR_ADDR,
            validator_reward_share: 4000,
            max_nominators_count: 100,
            min_validator_stake: 100000 * TON,
            min_nominator_stake: 100000 * TON
        },
        nominators: {
            ['0x' + NOMINATOR_1_ADDR]: makeNominator(400000 * TON, 0),
            ['0x' + NOMINATOR_2_ADDR]: makeNominator(500000 * TON, 0)
        },
        withdraw_requests: {
            ['0x' + NOMINATOR_2_ADDR]: []
        }
    });
}

funcer({'logVmOps': false, 'logFiftCode': false}, {
    'path': './func/',
    'fc': FC,
    "configParams": CONFIG_PARAMS,
    'data': storage(100000 * TON),
    'in_msgs': [
        {
            "contract_balance": (100000 + 400000 + 500000 + 1) * TON,
            "sender": '-1:' + VALIDATOR_ADDR,
            "amount": 10 * 1e9,
            "body": [
                "uint32", 5, // deposit validator
                "uint64", 123, // query_id
                "coins", 100000 * TON
            ],
            "new_data": storage(0),
            "out_msgs": [
                {
                    "type": "Internal",
                    "to": "-1:" + VALIDATOR_ADDR,
                    "amount":  100000 * TON,
                    "sendMode": 0,
                    "body": [
                    ],
                },
                {
                    "type": "Internal",
                    "to": "-1:" + VALIDATOR_ADDR,
                    "amount":  0,
                    "sendMode": 64 + 2,
                    "body": [
                    ],
                }
            ]
        },
    ],
});

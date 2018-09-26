module.exports = app => {
    // For CORS.
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, AuthorizationToken");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT");
        next();
    });

    app.get('/api/scenario', (req, res, next) => {
        res.send(mockGetAll);
        next();
    });

    app.get('/api/scenario/:id', (req, res, next) => {
        res.send(Object.assign({}, mockGetOne(req.params.id)));
        next();
    });

    app.post('/api/scenario/:scenarioName/:scenarioDescription/:monthEnd', (req, res, next) => {
        res.send(Object.assign({}, mockGetOne("f72a2e67-8d3b-429c-a630-19d75e01ae80")));
        next();
    });

    app.put('/api/scenario/:scenarioId', (req, res, next) => {
        res.send(Object.assign({}, mockGetOne(req.params.scenarioId)));
        next();
    });
}

const mockGetAll = [
    {
        "Id": "f72a2e67-8d3b-429c-a630-19d75e01ae80",
        "Name": "Foo",
        "Description": "Foo Scenario"
    },
    {
        "Id": "f72a2e67-8d3b-429c-a630-19d75e01ae81",
        "Name": "Bar",
        "Description": "Bar Scenario"
    },
    {
        "Id": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
        "Name": "Quux",
        "Description": "Quux Scenario"
    },
    {
        "Id": "f72a2e67-8d3b-429c-a630-19d75e01ae83",
        "Name": "Derp",
        "Description": "Derp Scenario"
    }
];

const mockGetOne = id => ({
    "Id": id,
    "CompanyId": "8ff74834-8023-4c8c-bf69-ca97e797c69d",
    "Name": mockGetAll.filter(n => id === n.Id)[0].Name,
    "Description": mockGetAll.filter(n => id === n.Id)[0].Description,
    "LOB": null,
    "ControlDate": null,
    "CurrentStartDate": null,
    "CurrentEndDate": null,
    "ForecastDate": null,
    "FileLocation": null,
    "CreatedBy": "sneal@cciadmin.com",
    "CreatedDateTime": "2018-08-10T16:42:04.777",
    "ModifiedBy": null,
    "ModifiedDateTime": null,
    "Company": null,
    "ScenarioForecasts": [
        {
            "Id": "a3748d37-638c-40e8-93fd-f6be4464e07c",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Sales",
            "GroupName": "Gross Revenue",
            "CurrentStartAmount": 6429336,
            "CurrentEndAmount": 8558454.39,
            "ForecastAmount": 11923527.8760783,
            "ForecastPercentChange": 0.393187056065886,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "1e1295fc-4ecc-42a3-983f-1e36f5e4df04",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Reimbursed Expenses",
            "GroupName": "Gross Revenue",
            "CurrentStartAmount": 0,
            "CurrentEndAmount": 0,
            "ForecastAmount": 0,
            "ForecastPercentChange": 0,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "fb73bca4-c288-4c35-a8d7-69979305029d",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Commissions and Agency Fees",
            "GroupName": "Gross Revenue",
            "CurrentStartAmount": 0,
            "CurrentEndAmount": 0,
            "ForecastAmount": 0,
            "ForecastPercentChange": 0,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "149c8e2c-41ec-4f21-b3d5-88377638674d",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Total Gross Revenue",
            "GroupName": "Gross Revenue",
            "CurrentStartAmount": 6429336,
            "CurrentEndAmount": 8558454.39,
            "ForecastAmount": 11923527.8760783,
            "ForecastPercentChange": 0.393187056065886,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "df6e3640-dcfb-4a0e-a5ac-1361df046840",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "COGS Payroll",
            "GroupName": "",
            "CurrentStartAmount": 0,
            "CurrentEndAmount": 0,
            "ForecastAmount": 0,
            "ForecastPercentChange": 0,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "739e78b0-9282-4faa-899e-7a519b2474ed",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "COGS Owner Base Pay",
            "GroupName": "",
            "CurrentStartAmount": 0,
            "CurrentEndAmount": 0,
            "ForecastAmount": 0,
            "ForecastPercentChange": 0,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "d3b6e7e8-fd24-4379-98a5-8c3891ea7871",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "COGS Contractors",
            "GroupName": "",
            "CurrentStartAmount": 0,
            "CurrentEndAmount": 0,
            "ForecastAmount": 0,
            "ForecastPercentChange": 0,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "8dc87b52-f6b0-4781-941d-ab37a6cc6433",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "COGS Materials",
            "GroupName": "",
            "CurrentStartAmount": 0,
            "CurrentEndAmount": 0,
            "ForecastAmount": 0,
            "ForecastPercentChange": 0,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "ee77cab3-0522-4346-9fcc-b2f9f4be40ab",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "COGS Comsns and Agency Fees",
            "GroupName": "",
            "CurrentStartAmount": 0,
            "CurrentEndAmount": 0,
            "ForecastAmount": 0,
            "ForecastPercentChange": 0,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "d934afb7-4dd6-4be6-840a-cff01373d61a",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "COGS Other",
            "GroupName": "",
            "CurrentStartAmount": 5965783,
            "CurrentEndAmount": 5637666.76,
            "ForecastAmount": 5792331.44570435,
            "ForecastPercentChange": 0.0274341659925192,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "4b32a304-b6ae-42a3-b642-dffd0cf57654",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Total COGS",
            "GroupName": "",
            "CurrentStartAmount": 5965783,
            "CurrentEndAmount": 5637666.76,
            "ForecastAmount": 5792331.44570435,
            "ForecastPercentChange": 0.0274341659925192,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "585da780-2f05-4f5f-9f3f-27feda9a59a2",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Gross Profit",
            "GroupName": "",
            "CurrentStartAmount": 463553,
            "CurrentEndAmount": 2920787.63,
            "ForecastAmount": 6131196.43037392,
            "ForecastPercentChange": 1.09915858564969,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "2dd1bc61-c62c-465b-b807-4836318c6af6",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Payroll",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 4262847,
            "CurrentEndAmount": 3870566.52,
            "ForecastAmount": 3887439.4701913,
            "ForecastPercentChange": 0.00435929730289319,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "8f1fd9d8-1759-4873-8b5c-1da61ed7dd4d",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Owner Base Pay",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 0,
            "CurrentEndAmount": 0,
            "ForecastAmount": 0,
            "ForecastPercentChange": 0,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "8322addb-8be2-4d8c-bed0-da612f138eab",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Benefits",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 506709,
            "CurrentEndAmount": 551150.74,
            "ForecastAmount": 624148.255947826,
            "ForecastPercentChange": 0.132445646263355,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "39d5b76a-8215-4210-bdac-7fb9e47235b1",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Insurance",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 0,
            "CurrentEndAmount": 0,
            "ForecastAmount": 0,
            "ForecastPercentChange": 0,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "467d0e75-22fd-4943-9e0f-4ccb653ccdd4",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Professional Fees",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 3607,
            "CurrentEndAmount": 5463.33,
            "ForecastAmount": 8789.01171304348,
            "ForecastPercentChange": 0.608727957682124,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "a910e223-47ed-4ed8-8410-aa486d0b16ed",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Subcontractors",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 0,
            "CurrentEndAmount": 0,
            "ForecastAmount": 0,
            "ForecastPercentChange": 0,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "1a062e44-46b5-4079-823c-eb7d34c4f122",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Rent",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 397131,
            "CurrentEndAmount": 414670.87,
            "ForecastAmount": 415441.616495652,
            "ForecastPercentChange": 0.0018586945730048,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "8e3a0c05-4366-4364-9b30-f597aad6bb51",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Tax & License",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 11498,
            "CurrentEndAmount": 7658,
            "ForecastAmount": 5119.94782608696,
            "ForecastPercentChange": -0.331424937831424,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "c1a43cdd-652d-4d59-b8fb-f09c11888961",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Phone & Communications",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 36890,
            "CurrentEndAmount": 37417.16,
            "ForecastAmount": 37487.5986434783,
            "ForecastPercentChange": 0.00188252244366627,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "6d729488-6756-4633-b5af-3fb7ed0fc03f",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Infrastructure",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 100702,
            "CurrentEndAmount": 105448.23,
            "ForecastAmount": 126703.344669565,
            "ForecastPercentChange": 0.201569193428522,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "490c699c-7591-4b12-9085-f91de073055d",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Auto and Travel",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 116686,
            "CurrentEndAmount": 107702.28,
            "ForecastAmount": 113407.73693913,
            "ForecastPercentChange": 0.0529743375825509,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "c42bf5aa-bba5-492c-b91c-9c86c53e94e7",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Reimbursable Expenses",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 0,
            "CurrentEndAmount": 0,
            "ForecastAmount": 0,
            "ForecastPercentChange": 0,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "f946c489-a5c5-4b8b-a9de-47389bef7a58",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Sales Expense",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 106732,
            "CurrentEndAmount": 136936.97,
            "ForecastAmount": 163110.974008696,
            "ForecastPercentChange": 0.191139062071372,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "6e00daa2-e034-4d6a-9ac7-5605ff8c65a0",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Marketing",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 88720,
            "CurrentEndAmount": 65835.5,
            "ForecastAmount": 43337.67,
            "ForecastPercentChange": -0.341727943130986,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "e5f5fa4b-7df8-466b-bca3-08353351b7ab",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Training and Certification",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 16245,
            "CurrentEndAmount": 19364.95,
            "ForecastAmount": 19644.8113478261,
            "ForecastPercentChange": 0.0144519530298854,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "a2464242-2c15-40e5-9fd3-76ba5bfa5ca6",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Meals and Entertainment",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 36616,
            "CurrentEndAmount": 55523.92,
            "ForecastAmount": 75075.1236869565,
            "ForecastPercentChange": 0.352122178818724,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "2a13319f-21a5-40fb-a871-a87903da72ef",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Interest Expense",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 0,
            "CurrentEndAmount": 0,
            "ForecastAmount": 0,
            "ForecastPercentChange": 0,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "44e8d64a-9ab6-4f23-ac18-1bf1483a6b4d",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Depreciation and Amortization",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 218165,
            "CurrentEndAmount": 208973.1,
            "ForecastAmount": 200741.649582609,
            "ForecastPercentChange": -0.039390000040155,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "bbacd5ee-fd3a-4fd9-a1f3-7b1b731e4dd8",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Other",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": -4137593,
            "CurrentEndAmount": -3791280.86,
            "ForecastAmount": -4043974.73208696,
            "ForecastPercentChange": 0.0666513195455944,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "f5fe61cf-58a0-46ad-a78c-b540678e940c",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Total Overhead",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": 1764955,
            "CurrentEndAmount": 1795430.71,
            "ForecastAmount": 1676472.47896522,
            "ForecastPercentChange": -0.0662560968642352,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "7f415ea0-bae1-4a81-ad7f-d8919e042cb7",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Net Profit",
            "GroupName": "\nSales,General,\nAdmin Expenses",
            "CurrentStartAmount": -1301402,
            "CurrentEndAmount": 1125356.92,
            "ForecastAmount": 4454723.9514087,
            "ForecastPercentChange": 2.95849874136705,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "2ac59621-e1fc-4b6f-88aa-b62cb4e96ade",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Owner Incentive",
            "GroupName": "",
            "CurrentStartAmount": 0,
            "CurrentEndAmount": 0,
            "ForecastAmount": 0,
            "ForecastPercentChange": 0,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "36dfe390-dc12-4a68-8801-2e74f5a0682f",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Other Income",
            "GroupName": "Non-Operating",
            "CurrentStartAmount": 0,
            "CurrentEndAmount": 0,
            "ForecastAmount": 0,
            "ForecastPercentChange": 0,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "f2e00147-9b1e-449d-8189-331f8b5e20e0",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Other Expense",
            "GroupName": "Non-Operating",
            "CurrentStartAmount": 471934,
            "CurrentEndAmount": 386262.88,
            "ForecastAmount": 323481.986852174,
            "ForecastPercentChange": -0.162534109277666,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        },
        {
            "Id": "c41ad532-1391-4093-ab01-60d90cf3e89e",
            "ScenarioId": "f72a2e67-8d3b-429c-a630-19d75e01ae82",
            "LineItem": "Total Profit",
            "GroupName": "Non-Operating",
            "CurrentStartAmount": -1773336,
            "CurrentEndAmount": 739094.040000001,
            "ForecastAmount": 4131241.96455652,
            "ForecastPercentChange": 4.58960259584358,
            "CreatedBy": "sneal@cciadmin.com",
            "CreatedDateTime": "2018-08-30T20:54:00.1495399Z",
            "ModifiedBy": "sneal@cciadmin.com",
            "ModifiedDateTime": "2018-08-30T20:54:00.1495399Z"
        }
    ],
    "ScenarioForecastOptions": [],
    "ScenarioOverrides": []
});


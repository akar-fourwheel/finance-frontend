import React, { useEffect, useState } from 'react';
import {fetchModels,fetchBanks,fetchTenures,fetchScheme,updateDatabase} from './api.js';

const SchemePage = (req, res) => {
    const [getBank, setGetBank] = useState([]);
    const [bank, setBank] = useState('');
    const [getModel, setGetModel] = useState([]);
    const [model, setModel] = useState('');
    const [getTenure, setGetTenure] = useState([]);
    const [tenure, setTenure] = useState('');
    const [finalData, setFinalData] = useState(null)

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await fetchScheme(model,bank,tenure);
            if(response){
                const data = response.data[0];
                setFinalData(data);
            }
        }catch(err){
            console.log("Error fetching schemes",err);
        }
    };

    const dataBasedOnModel = async (e) => {
        const selectedModel = e.target.value;
        setModel(selectedModel);
        setBank('');
        setGetBank([]);
        setTenure('');
        setGetTenure([]);

        // Fetch models based on selected year
        try{
            const res = await fetchBanks(selectedModel)
            const data = res.data;
            setGetBank(data)
        }catch(err){
            console.log("Error fetching banks",err)
        }
    };

    // Fetch fuel based on year and model
    const dataBasedOnModelAndBank = async (e) => {
        const selectedBank = e.target.value;
        setBank(selectedBank);
        setTenure('');
        setGetTenure([]);

        try{
            const response = await fetchTenures(model,selectedBank);
            if (response.data === "data not found") return;
            const data = response.data;
            setGetTenure(data);
        }catch(err){
            console.log("Error fetching tenure",err);
        }
    };

    // Fetch data when the year or model or fuel is selected

    useEffect(() => {
        // Fetch model initially
            fetchModels()
            .then((response) => {
                const fetchedModel = response.data;
                setGetModel(fetchedModel);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        const updateDb = async () => {
            try {
                await updateDatabase();
                console.log("Database updated successfully!");
                localStorage.setItem("lastUpdate", new Date().toDateString());
            } catch (error) {
                console.error("Error updating database:", error);
            }
        };

        const lastUpdate = localStorage.getItem("lastUpdate");
        const today = new Date().toDateString();

        if (lastUpdate !== today) {
            updateDb();
        }
    }, []);

    return (
        <div className="container">
            <div className="content-wrapper">
                {/* Header Card */}
                <div className="header-card">
                    <div className="header-gradient">
                        <h1 className="header-title">
                            Available Finance Schemes
                        </h1>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="main-card">
                    <div className="form-container">
                        {/* Model Selection */}
                        <div className="form-group">
                            <label className="form-label">
                                Model:
                            </label>
                            <select
                                value={model}
                                onChange={dataBasedOnModel}
                                className="form-select"
                            >
                                <option value="">Choose model</option>
                                {getModel.map((m,index) => (
                                    <option value={m.model} key={index}>
                                        {m.model}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Bank Selection */}
                        <div className="form-group">
                            <label className="form-label">
                                Bank:
                            </label>
                            <select
                                value={bank}
                                onChange={dataBasedOnModelAndBank}
                                className="form-select"
                            >
                                <option value="">Choose bank</option>
                                {getBank.map((b,index) => (
                                    <option value={b.bank} key={index}>
                                        {b.bank}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tenure Selection */}
                        <div className="form-group">
                            <label className="form-label">
                                Tenure (months):
                            </label>
                            <select
                                value={tenure}
                                onChange={(e) => setTenure(e.target.value)}
                                className="form-select"
                            >
                                <option value="">Choose Tenure</option>
                                {getTenure.map((t,index) => (
                                    <option value={t.tenure} key={index}>
                                        {t.tenure}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="submit-button"
                        >
                            Submit
                        </button>
                    </div>
                </div>

                {/* Results Card */}
                {finalData && (
                    <div className="results-card">
                        <h3 className="results-title">
                            Scheme Details
                        </h3>

                        <div className="results-grid">
                            {[
                                { label: 'ON-ROAD PRICE', value: finalData.on_road_price, format: 'currency' },
                                { label: 'LOAN AMOUNT', value: finalData.loan_amount, format: 'currency' },
                                { label: 'CASHBACK', value: finalData.cashback, format: 'percentage' },
                                { label: 'CASHBACK CAP', value: finalData.cashback_cap, format: 'currency' },
                                { label: 'CUSTOMER CASHBACK', value: finalData.customer_cashback, format: 'currency' },
                                { label: 'EFFECTIVE PRICE', value: finalData.effective_price, format: 'currency' },
                                { label: 'ROI', value: finalData.roi, format: 'percentage' },
                                { label: 'EMI WITH ROI', value: finalData.emi_with_roi, format: 'currency' },
                                { label: 'TOTAL OUTGOING', value: finalData.total_outgoing, format: 'currency' }
                            ].map((item, index) => (
                                <div key={index} className="result-item">
                                    <label className="form-label">
                                        {item.label}:
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={
                                            item.value ? (
                                                item.format === 'percentage'
                                                    ? `${item.value}%`
                                                    : `Rs. ${item.value.toLocaleString()}`
                                            ) : (
                                                item.format === 'percentage' ? '0%' : 'Rs. 0'
                                            )
                                        }
                                        className="result-input"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SchemePage;
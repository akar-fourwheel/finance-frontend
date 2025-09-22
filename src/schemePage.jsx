import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SchemePage = (req, res) => {
    const [getBank, setGetBank] = useState([]);
    const [bank, setBank] = useState('');
    const [getModel, setGetModel] = useState([]);
    const [model, setModel] = useState('');
    const [getTenure, setGetTenure] = useState([]);
    const [tenure, setTenure] = useState('');
    const [finalData, setFinalData] = useState([])

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.get(`/fetch-scheme`, {
            params: {
                model: model,
                bank: bank,
                tenure: tenure,
            },
        })
            .then((response) => {
                const data = response.data.flat();
                setFinalData(data);

            });
    };

    const dataBasedOnModel = (e) => {
        const selectedModel = e.target.value;
        setModel(selectedModel);
        setBank('');
        setGetBank([]);
        setTenure('');
        setGetTenure([]);

        // Fetch models based on selected year
        axios
            .get(`/fetch-scheme`, {
                params: { model: selectedModel },
            })
            .then((response) => {
                const data = response.data.flat();
                console.log("iugkjgjhjhg",data);
                setGetBank(data); // Clear fuel options when the year is changed
            });
    };

    // Fetch fuel based on year and model
    const dataBasedOnModelAndBank = (e) => {
        const selectedBank = e.target.value;
        setBank(selectedBank);
        setTenure('');
        setGetTenure([]);
        axios
            .get(`/fetch-scheme`, {
                params: {
                    model: model,
                    bank: selectedBank,
                },
            })
            .then((response) => {
                if (response.data === "data not found") return;
                const data = response.data.flat();
                setGetTenure(data); // Assuming fuel types are returned based on year and model
            });
    };

    // Fetch data when the year or model or fuel is selected

    useEffect(() => {
        // Fetch model initially
        axios
            .get(`/data`)
            .then((response) => {
                const fetchedModel = response.data.flat();
                setGetModel(fetchedModel);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        const updateDb = async () => {
            try {
                await axios.get('/update-db');
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
                                {getModel.map((md) => (
                                    <option value={md} key={md}>
                                        {md}
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
                                {getBank.map((b) => (
                                    <option value={b} key={b}>
                                        {b}
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
                                {getTenure.map((f) => (
                                    <option value={f} key={f}>
                                        {f}
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
                {finalData.length > 0 && (
                    <div className="results-card">
                        <h3 className="results-title">
                            Scheme Details
                        </h3>

                        <div className="results-grid">
                            {[
                                { label: 'ON-ROAD PRICE', value: finalData[0], format: 'currency' },
                                { label: 'LOAN AMOUNT', value: finalData[1], format: 'currency' },
                                { label: 'CASHBACK', value: finalData[2], format: 'percentage' },
                                { label: 'CASHBACK CAP', value: finalData[3], format: 'currency' },
                                { label: 'CUSTOMER CASHBACK', value: finalData[4], format: 'currency' },
                                { label: 'EFFECTIVE PRICE', value: finalData[5], format: 'currency' },
                                { label: 'ROI', value: finalData[6], format: 'percentage' },
                                { label: 'EMI WITH ROI', value: finalData[7], format: 'currency' },
                                { label: 'TOTAL OUTGOING', value: finalData[8], format: 'currency' }
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
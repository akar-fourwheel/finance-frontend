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

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
                {/* Header Card */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    marginBottom: '1.5rem',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
                        color: 'white',
                        textAlign: 'center',
                        padding: '1.5rem'
                    }}>
                        <h1 style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            margin: 0
                        }}>
                            Available Schemes on Cars
                        </h1>
                    </div>
                </div>

                {/* Main Content Card */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    padding: '1.5rem',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Model Selection */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '0.5rem'
                            }}>
                                Model:
                            </label>
                            <select
                                value={model}
                                onChange={dataBasedOnModel}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '0.95rem',
                                    backgroundColor: 'white',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '0.5rem'
                            }}>
                                Bank:
                            </label>
                            <select
                                value={bank}
                                onChange={dataBasedOnModelAndBank}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '0.95rem',
                                    backgroundColor: 'white',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#374151',
                                marginBottom: '0.5rem'
                            }}>
                                Tenure:
                            </label>
                            <select
                                value={tenure}
                                onChange={(e) => setTenure(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '0.95rem',
                                    backgroundColor: 'white',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                color: 'white',
                                fontWeight: '500',
                                borderRadius: '6px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease-in-out'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            Submit
                        </button>
                    </div>
                </div>

                {/* Results Card */}
                {finalData.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        padding: '1.5rem'
                    }}>
                        <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            marginBottom: '1.5rem',
                            color: '#374151',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            Scheme Details
                        </h3>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '1rem'
                        }}>
                            {[
                                { label: 'ON-ROAD PRICE', value: finalData[0], format: 'currency' },
                                { label: 'LOAN AMOUNT', value: finalData[1], format: 'currency' },
                                { label: 'CASHBACK', value: finalData[2], format: 'currency' },
                                { label: 'CASHBACK CAP', value: finalData[3], format: 'currency' },
                                { label: 'CUSTOMER CASHBACK', value: finalData[4], format: 'currency' },
                                { label: 'EFFECTIVE PRICE', value: finalData[5], format: 'currency' },
                                { label: 'ROI', value: finalData[6], format: 'percentage' },
                                { label: 'EMI WITH ROI', value: finalData[7], format: 'currency' },
                                { label: 'TOTAL OUTGOING', value: finalData[8], format: 'currency' }
                            ].map((item, index) => (
                                <div key={index} style={{ marginBottom: '1rem' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        color: '#374151',
                                        marginBottom: '0.5rem'
                                    }}>
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
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            backgroundColor: '#f9fafb',
                                            fontSize: '0.95rem',
                                            color: '#374151'
                                        }}
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
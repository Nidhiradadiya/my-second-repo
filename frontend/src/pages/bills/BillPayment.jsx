import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { billAPI, paymentAPI } from '../../services/billing';
import './Bills.css';

function BillPayment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentForm, setPaymentForm] = useState({
        amount: '',
        paymentMode: 'Cash',
        notes: '',
    });
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        fetchBillAndPayments();
    }, [id]);

    const fetchBillAndPayments = async () => {
        try {
            const billData = await billAPI.getById(id);
            setBill(billData);

            // Fetch payments for this bill
            const paymentsData = await paymentAPI.getAll({ billId: id });
            setPayments(paymentsData.payments || []);
        } catch (error) {
            console.error('Error fetching bill:', error);
            alert('Bill not found');
            navigate('/bills');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        const paymentAmount = parseFloat(paymentForm.amount);
        const remainingAmount = bill.total - bill.paidAmount;

        if (paymentAmount <= 0) {
            alert('Payment amount must be greater than 0');
            return;
        }

        if (paymentAmount > remainingAmount) {
            alert(`Payment amount cannot exceed remaining balance of ₹${remainingAmount.toFixed(2)}`);
            return;
        }

        try {
            await paymentAPI.create({
                customerId: bill.customerId._id,
                billId: bill._id,
                amount: paymentAmount,
                paymentMode: paymentForm.paymentMode,
                notes: paymentForm.notes,
            });

            setPaymentForm({ amount: '', paymentMode: 'Cash', notes: '' });
            fetchBillAndPayments();
            alert('Payment recorded successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to record payment');
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!bill) {
        return <div>Bill not found</div>;
    }

    const remainingAmount = bill.total - bill.paidAmount;

    return (
        <div className="bill-view-container">
            <div className="page-header">
                <h1>Bill #{bill.billNumber} - Payment</h1>
                <button className="btn btn-secondary" onClick={() => navigate(`/bills/${id}`)}>
                    Back to Bill
                </button>
            </div>

            <div className="payment-summary">
                <div className="summary-row">
                    <span>Bill Total:</span>
                    <span className="amount">₹{bill.total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                    <span>Paid Amount:</span>
                    <span className="paid">₹{bill.paidAmount.toFixed(2)}</span>
                </div>
                <div className="summary-row outstanding-row">
                    <span>Remaining Amount:</span>
                    <span className="outstanding">₹{remainingAmount.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                    <span>Payment Status:</span>
                    <span className={`badge badge-${bill.paymentStatus.toLowerCase().replace(' ', '-')}`}>
                        {bill.paymentStatus}
                    </span>
                </div>
            </div>

            {remainingAmount > 0 && (
                <div className="payment-form-section">
                    <h2>Record New Payment</h2>
                    <form onSubmit={handlePaymentSubmit} className="payment-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Amount *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    max={remainingAmount}
                                    value={paymentForm.amount}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                                    required
                                    className="input"
                                    placeholder={`Max: ₹${remainingAmount.toFixed(2)}`}
                                />
                            </div>

                            <div className="form-group">
                                <label>Payment Mode</label>
                                <select
                                    value={paymentForm.paymentMode}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })}
                                    className="input"
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="Online">Online</option>
                                    <option value="Card">Card</option>
                                    <option value="UPI">UPI</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Notes</label>
                            <textarea
                                value={paymentForm.notes}
                                onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                                className="input"
                                rows="2"
                                placeholder="Add payment notes..."
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Record Payment
                        </button>
                    </form>
                </div>
            )}

            {payments.length > 0 && (
                <div className="payments-history">
                    <h2>Payment History</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Mode</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment._id}>
                                    <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                    <td className="paid">₹{payment.amount.toFixed(2)}</td>
                                    <td>{payment.paymentMode}</td>
                                    <td>{payment.notes || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default BillPayment;

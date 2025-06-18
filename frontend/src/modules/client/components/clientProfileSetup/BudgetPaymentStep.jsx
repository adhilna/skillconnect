import React from 'react';

export default function BudgetPaymentStep({
    clientData = {},
    errors = {},
    handleInputChange
}) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Budget & Payment</h2>
                <p className="text-white/70">Set up your payment preferences</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="monthlyBudget" className="block text-white/80 text-sm font-medium mb-2">
                        Monthly Budget (USD)
                    </label>
                    <input
                        id="monthlyBudget"
                        type="number"
                        min="0"
                        name="monthlyBudget"
                        value={clientData?.monthlyBudget || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 transition-colors"
                        placeholder="5000"
                    />
                    {errors.monthlyBudget && <p className="text-red-400 text-sm mt-1">{errors.monthlyBudget}</p>}
                </div>

                <div>
                    <label htmlFor="projectBudget" className="block text-white/80 text-sm font-medium mb-2">
                        Per Project Budget (USD)
                    </label>
                    <input
                        id="projectBudget"
                        type="number"
                        min="0"
                        name="projectBudget"
                        value={clientData?.projectBudget || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-400 transition-colors"
                        placeholder="1000"
                    />
                    {errors.projectBudget && <p className="text-red-400 text-sm mt-1">{errors.projectBudget}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="paymentMethod" className="block text-white/80 text-sm font-medium mb-2">
                    Preferred Payment Method
                </label>
                <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={clientData?.paymentMethod || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400 transition-colors"
                >
                    <option value="" className="bg-gray-800">Select payment method</option>
                    <option value="credit-card" className="bg-gray-800">Credit Card</option>
                    <option value="debit-card" className="bg-gray-800">Debit Card</option>
                    <option value="paypal" className="bg-gray-800">PayPal</option>
                    <option value="bank-transfer" className="bg-gray-800">Bank Transfer</option>
                    <option value="stripe" className="bg-gray-800">Stripe</option>
                </select>
                {errors.paymentMethod && <p className="text-red-400 text-sm mt-1">{errors.paymentMethod}</p>}
            </div>

            <div>
                <label htmlFor="paymentTiming" className="block text-white/80 text-sm font-medium mb-2">
                    Payment Timing Preference
                </label>
                <select
                    id="paymentTiming"
                    name="paymentTiming"
                    value={clientData?.paymentTiming || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400 transition-colors"
                >
                    <option value="">When do you prefer to pay?</option>
                    <option value="upfront" className="bg-gray-800">100% Upfront</option>
                    <option value="milestone-based" className="bg-gray-800">Milestone-based payments</option>
                    <option value="upon-completion" className="bg-gray-800">Upon project completion</option>
                    <option value="monthly" className="bg-gray-800">Monthly payments</option>
                </select>
                {errors.paymentTiming && <p className="text-red-400 text-sm mt-1">{errors.paymentTiming}</p>}
            </div>

            <div>
                <label htmlFor="previousExperience" className="block text-white/80 text-sm font-medium mb-2">
                    Previous Experience with Freelancers
                </label>
                <select
                    id="previousExperience"
                    name="previousExperience"
                    value={clientData?.previousExperience || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400 transition-colors"
                >
                    <option value="" className="bg-gray-800">Select your experience level</option>
                    <option value="first-time" className="bg-gray-800">This is my first time hiring</option>
                    <option value="some" className="bg-gray-800">I&#39;ve hired 1-5 freelancers</option>
                    <option value="experienced" className="bg-gray-800">I&apos;ve hired 6-20 freelancers</option>
                    <option value="very-experienced" className="bg-gray-800">I&apos;ve hired 20+ freelancers</option>
                </select>
                {errors.previousExperience && <p className="text-red-400 text-sm mt-1">{errors.previousExperience}</p>}
            </div>

            <div>
                <label htmlFor="expectedTimeline" className="block text-white/80 text-sm font-medium mb-2">
                    Expected Project Timeline
                </label>
                <select
                    id="expectedTimeline"
                    name="expectedTimeline"
                    value={clientData?.expectedTimeline || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400 transition-colors"
                >
                    <option value="" className="bg-gray-800">Typical project duration</option>
                    <option value="rush" className="bg-gray-800">Rush job (1-3 days)</option>
                    <option value="short" className="bg-gray-800">Short term (1-2 weeks)</option>
                    <option value="medium" className="bg-gray-800">Medium term (1-3 months)</option>
                    <option value="long" className="bg-gray-800">Long term (3+ months)</option>
                    <option value="ongoing" className="bg-gray-800">Ongoing relationship</option>
                </select>
                {errors.expectedTimeline && <p className="text-red-400 text-sm mt-1">{errors.expectedTimeline}</p>}
            </div>

            <div>
                <label htmlFor="qualityImportance" className="block text-white/80 text-sm font-medium mb-2">
                    Quality vs Speed Preference
                </label>
                <select
                    id="qualityImportance"
                    name="qualityImportance"
                    value={clientData?.qualityImportance || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400 transition-colors"
                >
                    <option value="" className="bg-gray-800">What matters most to you?</option>
                    <option value="quality-focused" className="bg-gray-800">Quality is paramount, I can wait</option>
                    <option value="balanced" className="bg-gray-800">Balance between quality and speed</option>
                    <option value="speed-focused" className="bg-gray-800">Speed is crucial, good quality is enough</option>
                    <option value="cost-focused" className="bg-gray-800">Cost-effective solutions preferred</option>
                </select>
                {errors.qualityImportance && <p className="text-red-400 text-sm mt-1">{errors.qualityImportance}</p>}
            </div>
        </div>
    );
}

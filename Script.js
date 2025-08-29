const API_KEY = 'cd0fcaec52e5e04943a18045';
const RATES_API = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
const REST_COUNTRIES_API = 'https://restcountries.com/v3.1/currency';

const fromSelect = document.getElementById('fromCurrency');
const toSelect = document.getElementById('toCurrency');
const amountInput = document.getElementById('amount');
const result = document.getElementById('result');
const rateInfo = document.getElementById('rateInfo');

let rates = {};

async function fetchCurrencyDetails(code) {
    try {
        const res = await fetch(`${REST_COUNTRIES_API}/${code.toLowerCase()}`);
        const data = await res.json();
        if (data.length > 0 && data[0].currencies && data[0].currencies[code]) {
            return data[0].currencies[code].name;
        }
    } catch (e) {
        console.warn(`Currency name fetch failed for ${code}`, e);
    }
    return code; // fallback
}

async function populateSelectsFromAPI() {
    try {
        showMessage('Loading currencies...', 'info');
        const res = await fetch(RATES_API);
        const data = await res.json();

        if (data.result !== 'success') throw new Error('API error');
        rates = data.conversion_rates;

        const currencyCodes = Object.keys(rates);

        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';

        const detailsPromises = currencyCodes.map(async code => {
            const name = await fetchCurrencyDetails(code);
            return { code, name };
        });

        const currencyDetails = await Promise.all(detailsPromises);

        currencyDetails.forEach(({ code, name }) => {
            const option1 = new Option(`${code} - ${name}`, code);
            const option2 = new Option(`${code} - ${name}`, code);
            fromSelect.appendChild(option1);
            toSelect.appendChild(option2);
        });

        fromSelect.value = 'USD';
        toSelect.value = 'EUR';

        const updated = new Date(data.time_last_update_utc);
        rateInfo.textContent = `Rates last updated: ${updated.toLocaleString()}`;
        showMessage('Ready to convert currencies');
    } catch (error) {
        showMessage('Failed to load currencies.', 'error');
    }
}

function convert() {
    const amount = parseFloat(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (!amount || amount < 0) return showMessage('Enter a valid amount', 'error');
    if (!rates[from] || !rates[to]) return showMessage('Invalid currencies', 'error');

    let usdAmount = from === 'USD' ? amount : amount / rates[from];
    let finalAmount = to === 'USD' ? usdAmount : usdAmount * rates[to];
    let rate = finalAmount / amount;

    showMessage(`${amount.toLocaleString()} ${from} = ${finalAmount.toFixed(2)} ${to}
    \n1 ${from} = ${rate.toFixed(4)} ${to}`, 'success');
}

function showMessage(msg, type = '') {
    result.className = '';
    result.style.color =
        type === 'error' ? '#e74c3c' :
            type === 'success' ? '#27ae60' :
                '#333';
    result.textContent = msg;
}

document.getElementById('converterForm').addEventListener('submit', e => {
    e.preventDefault();
    convert();
});

document.getElementById('swapBtn').addEventListener('click', () => {
    [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
    if (amountInput.value) convert();
});

[fromSelect, toSelect, amountInput].forEach(el =>
    el.addEventListener('input', () => {
        if (amountInput.value) convert();
    })
);

document.addEventListener('DOMContentLoaded', async () => {
    await populateSelectsFromAPI();
});

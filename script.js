document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const mikeBtn = document.getElementById('mike-btn');
    const resultsSection = document.getElementById('results');
    const percentageSection = document.getElementById('percentage-breakdown');
    const grossSalaryInput = document.getElementById('gross-salary');
    const tableBody = document.getElementById('percentage-table-body');

    // UI Elements
    const totalCostEl = document.getElementById('total-cost');
    const netMonthlyEl = document.getElementById('net-monthly');
    const barNet = document.getElementById('bar-net');
    const barTaxes = document.getElementById('bar-taxes');
    const netPercentEl = document.getElementById('net-percentage');
    const taxPercentEl = document.getElementById('tax-percentage');
    const spendingList = document.getElementById('spending-list');

    // Configuration
    const IRPF_BRACKETS = [
        { max: 12450, rate: 0.19 },
        { max: 20200, rate: 0.24 },
        { max: 35200, rate: 0.30 },
        { max: 60000, rate: 0.37 },
        { max: 300000, rate: 0.45 },
        { max: Infinity, rate: 0.47 }
    ];

    const PERSONAL_MINIMUM = 5550;
    const SS_EMPLOYEE_RATE = 0.0645; // Contingencias + Desempleo + Formación + MEI
    const SS_EMPLOYER_RATE = 0.31;   // Seguridad Social a cargo de la empresa (aprox 31%)
    const SS_MAX_BASE = 56646;       // Base máxima 2024
    const INDIRECT_TAX_RATE = 0.15;  // Estimación del 15% del neto en IVA/Impuestos especiales

    const SPENDING_CATEGORIES = [
        { name: "Pensiones y Protección Social", icon: "👵", percentage: 0.407, color: "#f43f5e" },
        { name: "Sanidad", icon: "🏥", percentage: 0.145, color: "#10b981" },
        { name: "Educación", icon: "🎓", percentage: 0.092, color: "#3b82f6" },
        { name: "Intereses de la Deuda", icon: "💸", percentage: 0.065, color: "#f59e0b" },
        { name: "Seguridad y Defensa", icon: "🛡️", percentage: 0.058, color: "#6366f1" },
        { name: "Economía e Infraestructuras", icon: "🏗️", percentage: 0.095, color: "#8b5cf6" },
        { name: "Servicios Públicos y Otros", icon: "🏛️", percentage: 0.138, color: "#94a3b8" }
    ];

    function calculateIRPF(taxableBase) {
        if (taxableBase <= 0) return 0;
        let remainingBase = taxableBase;
        let totalTax = 0;
        let previousMax = 0;

        for (const bracket of IRPF_BRACKETS) {
            const bracketSize = bracket.max - previousMax;
            const amountInBracket = Math.min(remainingBase, bracketSize);
            if (amountInBracket > 0) {
                totalTax += amountInBracket * bracket.rate;
                remainingBase -= amountInBracket;
            }
            previousMax = bracket.max;
            if (remainingBase <= 0) break;
        }
        return totalTax;
    }

    function formatCurrency(num) {
        return new Intl.NumberFormat('es-ES', { 
            style: 'currency', 
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(num);
    }

    function renderSpendingItem(category, userContribution) {
        const amount = userContribution * category.percentage;
        const div = document.createElement('div');
        div.className = 'spending-item';
        div.innerHTML = `
            <div class="item-info">
                <span class="item-label">${category.icon} ${category.name}</span>
                <span class="item-amount"><span>${formatCurrency(amount / 12)}</span> / mes</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" style="width: 0%; background: ${category.color};" data-width="${category.percentage * 100}%"></div>
            </div>
        `;
        return div;
    }

    calculateBtn.addEventListener('click', () => {
        const gross = parseFloat(grossSalaryInput.value);
        if (isNaN(gross) || gross <= 0) return;

        // 1. Employer Social Security
        const ssEmployer = Math.min(gross, SS_MAX_BASE) * SS_EMPLOYER_RATE;
        const totalEmployerCost = gross + ssEmployer;

        // 2. Employee Social Security
        const ssEmployee = Math.min(gross, SS_MAX_BASE) * SS_EMPLOYEE_RATE;

        // 3. IRPF
        const baseTax = calculateIRPF(gross - ssEmployee);
        const minTax = calculateIRPF(PERSONAL_MINIMUM);
        const irpf = Math.max(0, baseTax - minTax);

        // 4. Net & Indirect Taxes
        const netAnnual = gross - ssEmployee - irpf;
        const netMonthly = netAnnual / 12;
        const indirectTaxesAnnual = netAnnual * INDIRECT_TAX_RATE;

        // 5. Total Tax Contribution
        const totalTaxesAnnual = ssEmployer + ssEmployee + irpf + indirectTaxesAnnual;
        const taxPercentage = (totalTaxesAnnual / totalEmployerCost) * 100;
        const netPercentage = 100 - taxPercentage;

        // --- UI UPDATES ---
        resultsSection.classList.remove('hidden');
        
        // Update summary
        totalCostEl.innerText = formatCurrency(totalEmployerCost);
        netMonthlyEl.innerText = formatCurrency(netMonthly);

        // Update bars
        barNet.style.width = `${netPercentage}%`;
        barTaxes.style.width = `${taxPercentage}%`;
        netPercentEl.innerText = `${Math.round(netPercentage)}%`;
        taxPercentEl.innerText = `${Math.round(taxPercentage)}%`;

        // Reset and render spending list
        spendingList.innerHTML = '';
        SPENDING_CATEGORIES.forEach(cat => {
            const item = renderSpendingItem(cat, totalTaxesAnnual);
            spendingList.appendChild(item);
        });

        // Trigger animations
        setTimeout(() => {
            document.querySelectorAll('.progress-fill').forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    });

    // Populate and toggle the breakdown table
    mikeBtn.addEventListener('click', () => {
        if (percentageSection.classList.contains('hidden')) {
            // Fill table if it doesn't have rows
            if (tableBody.querySelectorAll('tr').length === 0) {
                tableBody.innerHTML = ''; // Clear comments
                SPENDING_CATEGORIES.forEach(cat => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${cat.icon} ${cat.name}</td>
                        <td class="text-right"><span class="table-percent-tag">${(cat.percentage * 100).toFixed(1)}%</span></td>
                    `;
                    tableBody.appendChild(row);
                });
            }
            percentageSection.classList.remove('hidden');
            percentageSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            percentageSection.classList.add('hidden');
        }
    });
});

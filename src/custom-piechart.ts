import ApexCharts from 'apexcharts';

class CustomPieChart extends HTMLElement {
    private invested: number = 0;
    private growth: number = 0;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.invested = Number(this.getAttribute('invested')) || 0;
        this.growth = Number(this.getAttribute('growth')) || 0;
        this.render();
        this.drawChart();
    }

    drawChart() {
        const options = {
            chart: {
                type: 'pie',
                width: 380,
            },
            series: [this.invested, this.growth],
            labels: ['Total SIP Amount Invested', 'Total Growth'],
            colors: ['#007bff', '#ff6347'],
        };

        const chart = new ApexCharts(this.shadowRoot?.querySelector('#pieChart'), options);
        chart.render();
    }

    render() {
        this.shadowRoot!.innerHTML = `
            <style>
                #pieChart {
                    max-width: 100%;
                    height:300px;
                }
            </style>
            <div id="pieChart"></div>
        `;
    }
}

customElements.define('custom-piechart', CustomPieChart);

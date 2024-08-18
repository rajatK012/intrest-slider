class CustomSlider extends HTMLElement {
    private sliderValue: number = 0;
    private markers: { count: number, labels: string[] } = { count: 0, labels: [] };
    private isSliding = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['markers'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'markers') {
            this.markers = JSON.parse(newValue);
            this.render(); // Re-render to include markers
        }
    }

    connectedCallback() {
        this.render();
        this.updateSlider(this.sliderValue);

        const thumb = this.shadowRoot?.querySelector('#slider-thumb');
        //@ts-ignore
        thumb?.addEventListener('mousedown', (e) => this.onMouseDown(e));
    }

    onMouseDown(e: MouseEvent) {
        const onMouseMove = (event: MouseEvent) => {
            this.isSliding = true;
            const slider = this.shadowRoot?.querySelector('#slider');
            const sliderRect = slider?.getBoundingClientRect();
            if (sliderRect) {
                const value = event.clientX - sliderRect.left;
                this.updateSlider(value);
                this.updateTooltipVisibility(true); // Show tooltip while sliding
            }
        };

        const onMouseUp = () => {
            this.isSliding = false;
            this.updateTooltipVisibility(false); // Hide tooltip when not sliding
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    updateSlider(value: number) {
        const slider = this.shadowRoot?.querySelector('#slider') as HTMLElement;
        const maxValue = slider.clientWidth;
        this.sliderValue = Math.min(Math.max(value, 0), maxValue);

        const thumb = this.shadowRoot?.querySelector('#slider-thumb') as HTMLElement;
        const tooltip = this.shadowRoot?.querySelector('#tooltip') as HTMLElement;

        thumb.style.left = `${this.sliderValue}px`;
        tooltip.style.left = `${this.sliderValue}px`;
        tooltip.innerHTML = `${Math.round((this.sliderValue / maxValue) * 100)}%`;

        this.setAttribute('value', `${Math.round((this.sliderValue / maxValue) * 100)}`);
    }

    updateTooltipVisibility(visible: boolean) {
        const tooltip = this.shadowRoot?.querySelector('#tooltip') as HTMLElement;
        tooltip.style.opacity = visible ? '1' : '0';
    }

    render() {
        const markerHtml = this.markers.count > 0 ? `
            <div id="markers">
                ${this.markers.labels.map((label, index) => `
                    <div class="marker" style="left: ${(index / (this.markers.count - 1)) * 100}%;">
                        <span>${label}</span>
                    </div>
                `).join('')}
            </div>
        ` : '';

        this.shadowRoot!.innerHTML = `
            <style>
                #slider-container {
                    position: relative;
                    width: 300px;
                    margin: 50px auto;
                }

                #slider {
                    position: relative;
                    height: 8px;
                    background-color: #ddd;
                    border-radius: 4px;
                }

                #slider-thumb {
                    position: absolute;
                    top: -6px;
                    width: 20px;
                    height: 20px;
                    background-color: #ff6347;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                #slider-thumb:hover {
                    background-color: #ff4500;
                }

                #tooltip {
                    position: absolute;
                    top: -30px;
                    left: 0;
                    background-color: #333;
                    color: #fff;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 14px;
                    transform: translateX(-50%);
                    white-space: nowrap;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                #markers {
                    position: relative;
                    height: 16px;
                }

                .marker {
                    position: absolute;
                    bottom: 0;
                    width: 20px;
                    text-align: center;
                }

                .marker span {
                    display: block;
                    font-size: 12px;
                }
            </style>
            <div id="slider-container">
                <div id="slider">
                    <div id="slider-thumb"></div>
                </div>
                ${markerHtml}
                <div id="tooltip">0%</div>
            </div>
        `;
    }
}

customElements.define('custom-slider', CustomSlider);

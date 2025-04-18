// Wait for YouTube's top-level buttons to be available
const waitForTopButtons = () => {
    const targetSelector = "#top-level-buttons-computed";

    const observer = new MutationObserver(() => {
        const parentDiv = document.querySelector(targetSelector);

        if (parentDiv && !document.querySelector("#vidscript-extract-button")) {
            // Create and insert the button
            const button = document.createElement("button");
            button.id = "vidscript-extract-button";
            button.className = `
                yt-spec-button-shape-next 
                yt-spec-button-shape-next--tonal 
                yt-spec-button-shape-next--mono 
                yt-spec-button-shape-next--size-m 
                yt-spec-button-shape-next--icon-leading 
                yt-spec-button-shape-next--enable-backdrop-filter-experiment
            `.trim();
            button.ariaDisabled = "false";
            button.ariaLabel = "Extract Text";
            button.title = "Extract Text";
            button.style.marginLeft = "8px";

            // SVG icon wrapper
            const iconWrapper = document.createElement("div");
            iconWrapper.className = "yt-spec-button-shape-next__icon";
            iconWrapper.setAttribute("aria-hidden", "true");

            // SVG element
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("version", "1.0");
            svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svg.setAttribute("width", "20");
            svg.setAttribute("height", "24");
            svg.setAttribute("viewBox", "0 0 600 600");
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

            svg.innerHTML = `
                <g transform="matrix(0.1, 0, 0, -0.1, -203.299118, 898.282043)" fill="#000000" stroke="none">
                    <path d="M 2693.46 8946.44 C 2392.42 8891.72 2141.39 8680.22 2078.63 8425.44 C 2060.98 8353.57 2060 8263.74 2060 5965.76 C 2060 3331.33 2056.07 3515.08 2120.8 3381.97 C 2225.72 3168.82 2439.49 3017.75 2698.36 2973.66 C 2787.59 2958.13 2855.26 2957.32 5058.65 2957.32 C 7560.13 2957.32 7393.42 2954.05 7549.34 3007.95 C 7815.08 3099.42 8014.14 3319.9 8051.4 3561.63 C 8059.24 3610.62 8061.21 4329.25 8059.24 6015.58 L 8056.3 8400.12 L 8033.75 8461.37 C 7984.72 8592.84 7878.82 8726.76 7761.15 8804.34 C 7667.01 8867.22 7603.27 8895.8 7492.46 8928.47 L 7399.31 8955.42 L 5080.21 8957.05 C 3055.29 8957.87 2752.29 8957.05 2693.46 8946.44 Z M 7360.08 8619.79 C 7477.76 8594.47 7575.81 8526.7 7631.71 8430.33 L 7664.07 8375.62 L 7667.01 5995.16 C 7668.98 4206.75 7667.01 3603.27 7658.19 3569.78 C 7624.85 3439.13 7516.98 3338.68 7364.01 3299.49 C 7306.15 3284.79 7235.55 3283.97 5055.7 3283.97 C 2830.74 3283.97 2806.23 3283.97 2743.47 3300.3 C 2624.82 3330.51 2526.76 3406.47 2480.67 3502.01 L 2457.14 3549.37 L 2457.14 5958.42 L 2457.14 8367.45 L 2479.69 8414.81 C 2525.78 8509.55 2624.82 8585.49 2743.47 8616.52 C 2798.38 8631.22 2881.73 8632.04 5050.8 8632.04 C 7055.12 8632.85 7308.12 8631.22 7360.08 8619.79 Z"/>
                    <path d="M 3148.45 8002.42 C 3124.92 7991.8 3091.58 7969.76 3075.89 7952.6 L 3045.49 7920.76 L 3042.55 7153.14 C 3040.59 6414.9 3040.59 6384.69 3059.22 6351.21 C 3086.68 6298.13 3137.67 6270.37 3211.21 6266.28 C 3284.76 6263.01 3274.95 6258.12 3639.72 6450.02 C 3792.7 6530.86 4105.51 6695.01 4334.97 6815.87 C 4564.42 6935.91 4760.55 7040.43 4770.35 7047.79 C 4802.71 7070.65 4827.23 7127.82 4820.36 7162.93 C 4808.59 7220.91 4763.49 7249.49 4364.39 7455.28 C 4156.5 7562.26 3835.85 7728.04 3650.52 7823.58 C 3466.16 7919.13 3299.47 8002.42 3280.83 8008.95 C 3233.77 8025.28 3198.47 8023.65 3148.45 8002.42 Z" style="paint-order: stroke markers; fill-rule: evenodd;"/>
                    <path d="M 4898.81 7904.56 C 4821.34 7889.88 4766.43 7850.54 4766.43 7808.58 C 4766.43 7765.59 4825.26 7723.1 4901.75 7711.56 C 4925.28 7708.42 5294.97 7706.31 5987.26 7706.31 C 6989.42 7706.31 7038.46 7706.83 7076.7 7716.29 C 7125.73 7728.35 7156.12 7744.07 7179.66 7771.88 C 7222.8 7821.17 7181.62 7877.3 7085.52 7900.89 C 7048.26 7910.33 6997.27 7910.86 5987.26 7910.33 C 5275.35 7910.33 4918.42 7908.23 4898.81 7904.56 Z"/>
                    <path d="M 4933.12 6644.79 C 4830.17 6636.23 4766.43 6598.21 4766.43 6545.2 C 4766.43 6503.43 4825.26 6457.91 4891.94 6447.2 C 4906.65 6445.07 5399.89 6443.46 5987.26 6443.46 C 7052.18 6443.46 7056.11 6443.46 7095.33 6454.7 C 7116.9 6460.6 7148.28 6476.12 7163.97 6488.43 C 7189.46 6507.71 7193.39 6516.29 7193.39 6544.66 C 7193.39 6585.9 7161.03 6616.42 7097.29 6634.62 L 7056.11 6646.93 L 6016.68 6647.48 C 5445 6648.02 4957.64 6646.93 4933.12 6644.79 Z"/>
                    <path d="M 3134.73 5376.8 C 2984.7 5348.18 2970.96 5233.64 3112.17 5192.81 L 3153.36 5180.6 L 5104.73 5180.6 L 7056.11 5180.6 L 7102.19 5194.94 C 7156.12 5212.43 7189.46 5238.94 7196.33 5271.28 C 7206.14 5317.94 7146.32 5366.73 7063.95 5378.94 C 7038.46 5383.18 6415.78 5384.77 5099.83 5384.77 C 3488.72 5384.23 3167.09 5383.18 3134.73 5376.8 Z"/>
                    <path d="M 3155.4 4111.97 C 2960.6 4074.27 2965.62 3960.69 3164.19 3925.61 C 3205.67 3918.81 3424.35 3917.76 5109.68 3917.76 C 7149.42 3917.76 7055.15 3916.72 7124.27 3942.88 C 7195.92 3969.59 7217.28 4027.16 7170.77 4066.95 C 7143.13 4090.51 7099.14 4106.21 7033.79 4115.64 C 7002.37 4120.34 6513.49 4121.91 5098.36 4121.91 C 3284.85 4121.91 3203.15 4121.4 3155.4 4111.97 Z"/>
                    <path d="M 3311.57 7723.85 C 3295.17 7716.46 3271.93 7701.08 3261 7689.14 L 3239.82 7666.94 L 3237.76 7132.01 C 3236.4 6617.57 3236.4 6596.51 3249.39 6573.18 C 3268.52 6536.19 3304.05 6516.85 3355.3 6513.99 C 3406.55 6511.71 3399.72 6508.3 3653.92 6642.04 C 3760.52 6698.38 3978.51 6812.76 4138.41 6896.98 C 4298.31 6980.63 4434.97 7053.48 4441.81 7058.6 C 4464.36 7074.54 4481.45 7114.38 4476.66 7138.84 C 4468.45 7179.24 4437.03 7199.17 4158.91 7342.57 C 4014.04 7417.13 3790.59 7532.64 3661.44 7599.22 C 3532.97 7665.81 3416.8 7723.85 3403.82 7728.4 C 3371.02 7739.79 3346.41 7738.65 3311.57 7723.85 Z" style="fill: rgb(255, 255, 255);"/>
                </g>
            `;

            iconWrapper.appendChild(svg);

            // Text label
            const label = document.createElement("span");
            label.className = "yt-spec-button-shape-next__label";
            label.textContent = "VidScript";

            button.appendChild(iconWrapper);
            button.appendChild(label);

            parentDiv.appendChild(button);
            console.log("✅ VidScript button added");
        }
    });

    // Start observing changes in the DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
};

// Start the setup
waitForTopButtons();

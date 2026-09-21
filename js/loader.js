const LoaderEngine = {
    init() {
        const loader = document.getElementById('loader');
        if (!loader) {
            document.body.classList.remove('is-loading');
            document.dispatchEvent(new CustomEvent('av:loaded'));
            return;
        }

        const lines = loader.querySelectorAll('.loader__line');
        const progressBar = loader.querySelector('.loader__progress-bar');

        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 28 + 12;
            if (progress > 100) progress = 100;
            if (progressBar) progressBar.style.width = progress + '%';
            if (progress >= 100) clearInterval(progressInterval);
        }, 100);

        setTimeout(() => { if (lines[0]) lines[0].classList.add('is-visible'); }, 80);
        setTimeout(() => { if (lines[1]) lines[1].classList.add('is-visible'); }, 350);
        setTimeout(() => { if (lines[2]) lines[2].classList.add('is-visible'); }, 650);

        const finish = () => {
            clearInterval(progressInterval);
            if (progressBar) progressBar.style.width = '100%';
            loader.classList.add('is-done');
            document.body.classList.remove('is-loading');
            document.dispatchEvent(new CustomEvent('av:loaded'));

            setTimeout(() => {
                if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
            }, 700);
        };

        setTimeout(finish, 1200);

        // click to skip
        loader.addEventListener('click', finish, { once: true });
    }
};
export const scrollToComponent = (componentRef) => {
    const targetY = componentRef.getBoundingClientRect().top;
    scrollToY(targetY);
}

export const scrollToY = (scrollTargetY, speed = 2000) => {
    let scrollY = window.scrollY || document.documentElement.scrollTop,
    currentTime = 0,
    time = Math.max(.1, Math.min(Math.abs(scrollTargetY) / speed, .8)), // min time .1, max time .8 seconds
    easeOutSine = function (position) {
        return Math.sin(position * (Math.PI / 2));
    };

    // animation loop
    function tick() {
        currentTime += 1 / 60;
        let position = currentTime / time;
        let t = easeOutSine(position);

        if (position < 1) {
            window.setTimeout(tick, 1000/60);
            window.scrollTo(0, scrollY + ((scrollTargetY) * t));
        }
    }
    tick();
}
const __eval = evalCore.getEvalInstance(window);
window.addEventListener("forwarding", ({detail: {cmd}}) => {
    __eval(cmd);
});
document.addEventListener("DOMContentLoaded", function () {
    $('.btn-up').on('click', volumeClick);
    $('.btn-down').on('click', volumeClick);

    function volumeClick() {
        const url = '/rest/items/OnkyoAVReceiver_SendButtonPress';
        const numTimes = range.value;
        const {command} = this.dataset;
        for (let i = 0; i < numTimes; i++) {
            $.post({
                url,
                data: command,
                contentType: 'text/plain'
            }).done(() => {
                console.log(`${command} was run`);
            })
        }
    }
});
document.addEventListener("DOMContentLoaded", function () {


    function getOptions(url, parseFunc, alwaysFunc) {
        $.getJSON(url)
            .done(parseFunc.bind(this))
            .fail(function () {
                console.log("error");
            })
            .always(alwaysFunc);
    }

    function sendCmd() {
        const {command, url, updatelabel} = this.dataset;
        $.post({
            url,
            data: command,
            contentType: 'text/plain'
        }).done(() => {
            console.log(`${command} was run`);
            if (updatelabel) {
                $(`.${updatelabel}`).text(command);
            }
        })
    }


    const parsers = {
        harmonyHub(data){
            let {options} = data.stateDescription;
            const url = '/rest/items/HarmonyHubJoeHub_CurrentActivity';

            options = options.sort((a,b)=> {
                const nameA = a.label.toUpperCase();
                const nameB = b.label.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
            const items = options.map((e, i) => {
                let item = $("<li/>");
                let aTag = $("<a>",
                    {
                        class: "activity-choice",
                        text: e.label,
                        'data-command': e.label,
                        'data-url': url,
                        'data-updatelabel': 'activity-label'
                    });
                item = item.append(aTag);
                aTag.on("click", sendCmd);
                return item;

            });
            this.append(items)
        },
        harmonyActivity(){
            $.get('/rest/items/HarmonyHubJoeHub_CurrentActivity/state')
                .done((data) => {
                    $(`.activity-label`).text(data);
                })
        }
    };


    getOptions.bind($('.dropdown-menu'))('/rest/items/HarmonyHubJoeHub_CurrentActivity', parsers.harmonyHub, parsers.harmonyActivity)

});
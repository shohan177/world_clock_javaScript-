
let input = document.querySelector('#search_time_zone');
let result_loading = document.querySelector('#result_loading')
let result_show = document.querySelector('#result_show')
let resut_list = document.querySelector('#resut_list')
let zone_select = document.getElementsByClassName('zone-select')
let show_clocks = document.querySelector('#show_anlog_clock')

pageLoad()
function pageLoad() {
    //loading div
    result_loading.style.display = 'none';
    //result div
    result_show.style.display = 'none';
    
    
}

/**
 * search input
 */
input.onkeyup = () => {
    
    let inputval = input.value;
    //loading div
    pageLoad()
    //console.log(inputval);
    serachZone(inputval);
}

/**
 * seach time zone funcation
 */
function serachZone(inputdata) {

    let session_storage = sessionStorage.getItem('all_zone');

    if (session_storage == null) {
        result_loading.style.display = 'block';
        getAllTimeZone()
        
    } else {
        
        //loading div
        result_loading.style.display = 'none';
        //result div
        result_show.style.display = 'block';

        
        let data = JSON.parse(session_storage);
        let resultData = "";
        for (let index = 0; index < data.length; index++) {
            if (data[index].toLowerCase().includes(inputdata)) {
                
                resultData += `<a href="#" onclick="selectZone('${data[index]}')" class="list-group-item list-group-item-action zone-select">${data[index]}</a>`
            } 
       
        }
        resut_list.innerHTML = resultData;
        
    }
}

/**
 * get all time zone form API
 */
 getAllTimeZone()
async function getAllTimeZone() {
    
    //time zone api
    let allTimeZone = await fetch('http://worldtimeapi.org/api/timezone/');
    let data = await allTimeZone.json();
    //store api data in session storage
    sessionStorage.setItem('all_zone',JSON.stringify(data))
    
}

/**
 * select zone 
 */
function selectZone(valu) {
    
    result_show.style.display = 'none';
    console.log(valu);
    let zone_arry = local_Storage();
    zone_arry.push(valu);
    //selected zone data store 
    localStorage.setItem('slected_zons', JSON.stringify(zone_arry));
    clockShow()
    input.value = "";

}

/**
 * local storage
 */
function local_Storage() {
    let storage = localStorage.getItem('slected_zons');

    let zone_arry = [];
    if (storage == null) {
        zone_arry = [];
    } else {
        zone_arry = JSON.parse(storage);
    }

    return zone_arry;
}
/**
 * get anlog clock position in deg
 */
function getAnlogClockPosiation(valu, range) {
    return (360 * valu) / range;
}

/**
 * render selected time zon's anlog clock
 */
 clockShow()
function clockShow() {
    
    let allZone = local_Storage();
    let allClocks = "";
    allZone.map((val, index) => {
        allClocks += `<div class="col-md-3 mt-3" id="time_container_${index}">
        <div class="clock shadow">
             <div class="second"></div>
             <div class="minute"></div>
             <div class="hours"></div>
             <button type="button" onclick="deleteClock('${index}')" class="btn-close btn-sm clock-close" aria-label="Close"></button>
             <p class="zone-name">Dhaka</p>
        </div>
    </div>`;       
    })
    show_clocks.innerHTML = allClocks;
    let time = new Date();
    allZone.map((val, index) => {

        let thisTime = time.toLocaleString('en-US', { timeZone: val });
        
        let arry = thisTime.split(",");
        //time array 
        let time_arry = arry[1].split(":");
        let h = time_arry[0];
        let m = time_arry[1];
        let status = time_arry[2].split(" ");
        let s = status[0];
        //am pm valu
        let status_valu = status[1];
  
        

        let sec = document.querySelector("#time_container_"+`${index}`+" "+ ".second");
        let min = document.querySelector("#time_container_"+`${index}`+" "+ ".minute");
        let hou = document.querySelector("#time_container_" + `${index}` + " " + ".hours");
        let click_div = document.querySelector("#time_container_" + `${index}` + " " + ".clock");
        let zone_name = document.querySelector("#time_container_" + `${index}` + " " + ".zone-name");

        let zone_string_arry = val.split('/');
        zone_name.innerHTML = zone_string_arry[1];

        
        let houre = getAnlogClockPosiation(h, 12);
        let minute = getAnlogClockPosiation(m, 60);
        let second = getAnlogClockPosiation(s, 60);
        
        sec.style.transform = `rotate(${second}deg)`
        min.style.transform = `rotate(${minute}deg)`
        hou.style.transform = `rotate(${houre}deg)`

        if (status_valu == "PM" && h > 6) {
            
            click_div.style.backgroundImage = "url(asset/image/night.png)"

        }else  if (status_valu == "AM" && h < 6) {
            
            click_div.style.backgroundImage = "url(asset/image/night.png)"
        }else if (status_valu == "AM" && h == 12) {
            
            click_div.style.backgroundImage = "url(asset/image/night.png)"
        } else {
            click_div.style.backgroundImage = "url(asset/image/day.png)"
        }
       
       
        console.log(click_div);
        
    })




}

setInterval(() => {
    clockShow()
}, 1000);

function deleteClock(index) {
    let storage = localStorage.getItem('slected_zons');
    let zone_array = JSON.parse(storage);
    zone_array.splice(index, 1);
    localStorage.setItem('slected_zons', JSON.stringify(zone_array));
    clockShow()
}
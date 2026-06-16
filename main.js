const BRSIG = "...$$$";

const id = (id) => document.getElementById(id);

function getHTML(ref) {
    const content = ref.content.replaceAll(BRSIG, "<br>");
    const lines = content.split("\n");
    
    let html = "";
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (!line.trim()) continue;
        
        const ch = line[0];
        
        let styling = "";
        
        if (ch === ".") styling = "text-align:center;";
        if (ch === ">") styling = "text-align:right;";
        if (ch === "<") styling = "text-align:left;";
        
        html += `<p style="${styling}">${line.slice([".", ">", "<"].includes(ch))}</p>`;
    }
    
    return html;
}

function getVisibleRefs() {
    return data
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !item.hidden);
}

function buildSelector() {
    let html = "";
    
    for (const { item, index } of getVisibleRefs()) {
        html += `<option value="${index}">${item.ref}</option>`;
    }
    
    id("ref").innerHTML = html;
}

function updateURL(ref) {
    const url = new URL(location.href);
    
    url.searchParams.set("ref", ref.ref);
    
    history.replaceState({}, "", url);
}

function setRef(index, pushURL = true) {
    index = Number(index);
    
    const ref = data[index];
    
    if (!ref || ref.hidden) return;
    
    if (pushURL) {
        updateURL(ref);
    }
    
    id("contents").innerHTML = getHTML(ref);
    
    id("contents").style.fontFamily =
        ref.font || "urdu";
    
    id("contents").style.textAlign =
        ref.align || "right";
    
    id("contents").style.direction =
        ref.urdu === false ? "ltr" : "rtl";
    
    id("ref").value = index;
    
    document.title = ref.ref;
}

function getRefFromURL() {
    const refCode =
        new URLSearchParams(location.search)
        .get("ref");
    
    if (!refCode) return null;
    
    return data.findIndex(
        item =>
        !item.hidden &&
        item.ref.toLowerCase() ===
        refCode.toLowerCase()
    );
}

function getFirstVisibleRef() {
    for (let i = 0; i < data.length; i++) {
        if (!data[i].hidden) {
            return i;
        }
    }
    
    return 0;
}

buildSelector();

const startRef =
    getRefFromURL() ??
    getFirstVisibleRef();

setRef(startRef, false);

window.addEventListener("popstate", () => {
    const ref =
        getRefFromURL() ??
        getFirstVisibleRef();
    
    setRef(ref, false);
});
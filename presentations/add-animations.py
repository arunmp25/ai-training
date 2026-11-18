"""Add click animations and fade transitions to a pptx built by build-deck.js.

Usage: python3 add-animations.py in.pptx out.pptx

Every shape whose name starts with "a<N>-" fades in on click N of its slide.
Shapes sharing the same N appear together. Every slide also gets a fade transition.
Standard library only.
"""
import re
import sys
import zipfile

SHAPE_RE = re.compile(r'<p:cNvPr id="(\d+)" name="a(\d+)-[^"]*"')
OPEN_RE = re.compile(r"<p:(sp|graphicFrame|cxnSp|pic)>")


def build_timing(groups, kinds):
    ids = iter(range(3, 100000))
    clicks = []
    for n in sorted(groups):
        effects = []
        for i, spid in enumerate(groups[n]):
            node = "clickEffect" if i == 0 else "withEffect"
            effects.append(
                f'<p:par><p:cTn id="{next(ids)}" presetID="10" presetClass="entr" presetSubtype="0" fill="hold" grpId="0" nodeType="{node}">'
                f'<p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>'
                f'<p:set><p:cBhvr><p:cTn id="{next(ids)}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
                f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>'
                f'<p:to><p:strVal val="visible"/></p:to></p:set>'
                f'<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="{next(ids)}" dur="400"/>'
                f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr></p:animEffect>'
                f'</p:childTnLst></p:cTn></p:par>'
            )
        outer, inner = next(ids), next(ids)
        clicks.append(
            f'<p:par><p:cTn id="{outer}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst>'
            f'<p:par><p:cTn id="{inner}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>'
            + "".join(effects)
            + "</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>"
        )
    bld = []
    for n in sorted(groups):
        for spid in groups[n]:
            if kinds[spid] == "graphicFrame":
                bld.append(f'<p:bldGraphic spid="{spid}" grpId="0"><p:bldAsOne/></p:bldGraphic>')
            elif kinds[spid] == "sp":
                bld.append(f'<p:bldP spid="{spid}" grpId="0" animBg="1"/>')
    return (
        '<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
        '<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>'
        + "".join(clicks)
        + '</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
        '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>'
        "</p:childTnLst></p:cTn></p:par></p:tnLst>"
        + (f"<p:bldLst>{''.join(bld)}</p:bldLst>" if bld else "")
        + "</p:timing>"
    )


def process(xml):
    groups, kinds = {}, {}
    for m in SHAPE_RE.finditer(xml):
        spid, n = m.group(1), int(m.group(2))
        opens = list(OPEN_RE.finditer(xml, 0, m.start()))
        kinds[spid] = opens[-1].group(1) if opens else "sp"
        groups.setdefault(n, []).append(spid)
    extra = '<p:transition spd="med"><p:fade/></p:transition>'
    if groups:
        extra += build_timing(groups, kinds)
    if "</p:clrMapOvr>" in xml:
        return xml.replace("</p:clrMapOvr>", "</p:clrMapOvr>" + extra, 1), len(groups)
    return xml.replace("</p:sld>", extra + "</p:sld>", 1), len(groups)


def main(src, dst):
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if re.fullmatch(r"ppt/slides/slide\d+\.xml", item.filename):
                xml, n = process(data.decode("utf-8"))
                data = xml.encode("utf-8")
                print(f"{item.filename}: {n} click steps")
            zout.writestr(item, data)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])

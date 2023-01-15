import React from "react";
import { MapMarker, Map } from "react-kakao-maps-sdk";

const KakaoMap = () => {
    return (
        <Map center={{ lat: 37.55097217656227, lng: 126.92560428790415 }} style={{ width: "100%", height: "75%" }}>
            <MapMarker position={{ lat: 37.55097217656227, lng: 126.92560428790415 }}>
                <div style={{ color: "#000", fontWeight: "bold", textAlign:"center"}}>Hongik Univ.</div>
            </MapMarker>
        </Map>
    );
};

export default KakaoMap;
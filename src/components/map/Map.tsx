import {MapContainer, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
import {LatLngExpression} from "leaflet";

type MapProps = {
    mapDivId: string;
    children?: React.ReactNode;
    center: LatLngExpression;
}

export default function Map(props: MapProps) {
    return (
        <MapContainer center={props.center}
                      className={"mantine-Container-root"}
                      zoom={11}
                      scrollWheelZoom={true}
                      style={{height: "100%", width: "100%"}}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {props.children}
        </MapContainer>
    )
}
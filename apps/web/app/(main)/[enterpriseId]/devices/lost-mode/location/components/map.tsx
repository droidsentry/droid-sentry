"use client";

import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import { useTheme } from "next-themes";

export default function QRWidget() {
  const { resolvedTheme } = useTheme();

  // const mapId =
  //   resolvedTheme === "dark" ? "f047192c34e3c28f" : "da5fe562756ecf19";
  const mapId =
    resolvedTheme === "dark" ? "24e3e46b0e6c0c77" : "24e3e46b0e6c0c77";

  return (
    <div className="absolute inset-0">
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
      >
        <Map
          className="size-full *:!bg-transparent [&_iframe+div]:!border-ring [&_iframe+div]:rounded-lg"
          // defaultCenter={{ lat: 35.69025034295892, lng: 139.69001842593207 }}

          defaultCenter={{ lat: 35.7391026, lng: 139.6872151 }}
          defaultZoom={12} // 4
          gestureHandling={"greedy"}
          disableDefaultUI
          mapId={mapId}
        >
          {/* <Marker position={{ lat: 53.54992, lng: 10.00678 }} /> */}
          <AdvancedMarker
            // position={{ lat: 35.69025034295892, lng: 139.69001842593207 }}
            position={{ lat: 35.7391026, lng: 139.6872151 }}
            title={"AdvancedMarker with customized pin."}
            onClick={() => alert("click")}
          >
            <Pin
              // background={"#E4D2C0"}
              // glyphColor={"#E4D2C0"}
              // borderColor={"#E4D2C0"}
              scale={1}
            >
              {/* <div className="rounded-full -m-1 overflow-hidden">
                <Image src={Logo} alt="map-pin" width={24} height={24} />
              </div> */}
            </Pin>
          </AdvancedMarker>
          <AdvancedMarker
            position={{ lat: 35.69025034295892, lng: 139.69001842593207 }}
            title={"AdvancedMarker with customized pin."}
            onClick={() => alert("click")}
          ></AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
}

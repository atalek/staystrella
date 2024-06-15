<script lang="ts" setup>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})
interface MapProps {
  center?: number[]
}

const zoom = ref(4)

defineProps<MapProps>()
</script>

<template>
  <div class="w-full h-[40vh] z-10">
    <LMap
      ref="map"
      v-model:zoom="zoom"
      :center="(center  as L.PointExpression) || [51, 0.09]">
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"></LTileLayer>

      <LMarker
        v-if="center"
        :lat-lng="(center as L.LatLngExpression) ">
      </LMarker>
    </LMap>
  </div>
</template>

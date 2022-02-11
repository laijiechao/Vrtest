import React, { useState, useRef, useEffect } from "react"
import { Viewer } from "photo-sphere-viewer"
import { MarkersPlugin } from "photo-sphere-viewer/dist/plugins/markers"
import "photo-sphere-viewer/dist/photo-sphere-viewer.css"

// import MarkersPlugin from 'photo-sphere-viewer/dist/plugins/markers'
import "photo-sphere-viewer/dist/plugins/markers.css"

import { LeftOutlined, RightOutlined } from "@ant-design/icons"

import VrImg1 from "../../Img/vr-1.webp"
import VrImg2 from "../../Img/vr-2.webp"
import go from "../../Img/go.png"

import "./index.css"

function VrTest(props) {
  const viewer = useRef()
  const Vrimage = useRef()
  let { current: imgIndex } = useRef(0)
  const [img, setImg] = useState([VrImg1, VrImg2])

  useEffect(() => {
    Vrimage.current = new Viewer({
      container: viewer.current,
      panorama: img[imgIndex],
      size: {
        height: "100vh",
      },
      //导航栏文案
      caption: "文本测试",

      //初始经度，介于 0 和 2π 之间。
      defaultLat: 0.3,

      //初始缩放大小 0-100
      defaultZoomLvl: 0,

      //自定义导航
      // navbar: ["autorotate", "zoom"],

      // 显示导航栏
      // navbar: true,

      lang: {
        loadError: "请检查图片是否损坏",
      },

      loadingTxt: "加载中...",
      plugins: [
        [
          MarkersPlugin,
          {
            markers: common1(),
          },
        ],
      ],
    })
    let markersPlugin = Vrimage.current.getPlugin(MarkersPlugin)

    Vrimage.current.on("click", function (e, data) {
      console.log(e)
      console.log(data)
      if (data.rightclick) {
        console.log(markersPlugin)
        markersPlugin.addMarker({
          id: "#" + Math.random(),
          longitude: data.longitude,
          latitude: data.latitude,
          image: "https://photo-sphere-viewer.js.org/assets/pin-red.png",
          width: 32,
          height: 32,
          anchor: "bottom center",
          tooltip: "Generated pin",
          data: {
            generated: true,
          },
        })
      }
    })

    //右键创建标记 双击标记删除创建的标记
    markersPlugin.on("select-marker", function (e, marker, data) {
      console.log("点了某一个点")
      console.log(marker)
      // 判断是双击点击标记 还是右键点击标记
      console.log(data)
      if (marker.id === "#2") {
        markersPlugin.clearMarkers()
        imgIndex = 1
        Vrimage.current.setPanorama(img[imgIndex])
      }
      if (marker.data && marker.data.generated) {
        if (data.dblclick) {
          console.log(markersPlugin)
          // 下面用maker和用id删都可以
          // markersPlugin.removeMarker(marker);
          markersPlugin.removeMarker(marker.id)
        } else if (data.rightclick) {
          markersPlugin.updateMarker({
            id: marker.id,
            image: "https://photo-sphere-viewer.js.org/assets/pin-blue.png",
          })
        }
      }
    })

    return () => {
      //销毁
      Vrimage.current.destroy()
    }
  }, [])

  // 自定义的按钮
  function common1() {
    let a = []
    a.push(
      {
        id: "#2",
        tooltip: "第二个房间",
        latitude: -0.19873791397341045,
        longitude: 4.342302299501063,
        image: go,
        width: 64,
        height: 64,
        anchor: "bottom center",
        data: {
          generated: true,
        },
      },
      {
        //图片
        id: "image",
        longitude: 0.32,
        latitude: 0.11,
        image: go,
        width: 32,
        height: 32,
        anchor: "bottom center",
        tooltip: "A image marker. <b>Click me!</b>",
      },
      {
        // 文本样式
        id: "text",
        longitude: 0,
        latitude: 0,
        html: "HTML <b>marker</b> &hearts;",
        anchor: "bottom right",
        scale: [0.5, 1.5],
        style: {
          maxWidth: "100px",
          color: "white",
          fontSize: "20px",
          fontFamily: "Helvetica, sans-serif",
          textAlign: "center",
        },
        tooltip: {
          content: "An HTML marker",
          position: "right",
        },
      },
      {
        // 区域
        id: "polygon",
        polylineRad: [
          [6.2208, 0.0906],
          [0.0443, 0.1028],
          [0.2322, 0.0849],
          [0.4531, 0.0387],
          [0.5022, -0.0056],
          [0.4587, -0.0396],
          [0.252, -0.0453],
          [0.0434, -0.0575],
          [6.1302, -0.0623],
          [6.0094, -0.0169],
          [6.0471, 0.032],
          [6.2208, 0.0906],
        ],
        svgStyle: {
          fill: "rgba(200, 0, 0, 0.2)",
          stroke: "rgba(200, 0, 50, 0.8)",
          strokeWidth: "2px",
        },
        tooltip: {
          content: "A dynamic polygon marker",
          position: "right bottom",
        },
      },
      {
        // 路径点
        id: "polyline",
        polylinePx: [
          2478, 1635, 2184, 1747, 1674, 1953, 1166, 1852, 709, 1669, 301, 1519,
          94, 1399, 34, 1356,
        ],
        svgStyle: {
          stroke: "rgba(140, 190, 10, 0.8)",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "10px",
        },
        tooltip: "A dynamic polyline marker",
      }
    )
    return a
  }

  const handleLeftClick = () => {
    let markersPlugin = Vrimage.current.getPlugin(MarkersPlugin)

    if (!imgIndex) {
      console.log(markersPlugin)

      //清除标记
      markersPlugin.clearMarkers()

      imgIndex = img.length - 1

      //更改图片URL
      return Vrimage.current.setPanorama(img[imgIndex])
    }
    imgIndex = imgIndex - 1
    Vrimage.current.setPanorama(img[imgIndex]).then(() => {
      let com1 = common1()
      com1.map((items, index) => {
        console.log(com1[index])
        markersPlugin.addMarker(items)
      })
    })
  }

  const handleRightClick = () => {
    let markersPlugin = Vrimage.current.getPlugin(MarkersPlugin)

    markersPlugin.clearMarkers()

    if (imgIndex === img.length - 1) {
      imgIndex = 0
      Vrimage.current.setPanorama(img[imgIndex]).then(() => {
        let com1 = common1()
        com1.map((items, index) => {
          console.log(com1[index])
          markersPlugin.addMarker(items)
        })
      })
      return
    }
    imgIndex = imgIndex + 1
    Vrimage.current.setPanorama(img[imgIndex])
  }
  return (
    <>
      <div className='box'>
        <div id='viewer' ref={viewer}></div>
        <div className='box1'>
          <LeftOutlined
            className='left'
            style={{ margin: 8, padding: 8 }}
            onClick={handleLeftClick}
          />
          <RightOutlined
            className='right'
            style={{ margin: 8, padding: 8 }}
            onClick={handleRightClick}
          />
        </div>
      </div>
    </>
  )
}

export default VrTest

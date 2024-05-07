import { Media } from "../types"

const MediaDisplay = ({ media }: { media: Media[] }) => {
  function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  const renderMedia = (media: Media) => {
    const size = formatBytes(media.size)

    let source
    if (media.data) {
      source = `data:${media.type};base64,${media.data}`
    } else {
      source = media.url
    }
    if (media.type.startsWith("image")) {
      return (
        <img
          src={source}
          alt=""
          className="w-full h-auto rounded-lg border border-secondary-color"
        />
      )
    }

    if (media.type.startsWith("video")) {
      return (
        <video
          src={source}
          controls
          className="w-full h-auto rounded-lg border border-secondary-color"
        />
      )
    }

    if (media.type.startsWith("audio")) {
      return (
        <div className="bg-black/40 p-2 flex gap-2 flex-col">
          <div
            className="ml-2 cursor-pointer flex justify-between items-center"
            onClick={() => {
              const link = document.createElement("a")
              link.href = media.url
              link.download = media.title || ""
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
          >
            <div>
              <p className="text-highlight-color text-large">{media.title}</p>
              <p>{size}</p>
            </div>
            <DownloadIcon />
          </div>
          <audio src={source} controls className="w-full h-auto shadow-none" />
        </div>
      )
    } else {
      return (
        <div
          className="bg-black/40 p-2 cursor-pointer flex justify-between items-center"
          onClick={() => {
            const link = document.createElement("a")
            link.href = media.url
            link.download = media.title || ""
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }}
        >
          <div className="ml-2">
            <p className="text-highlight-color text-large">{media.title}</p>
            <p>{size}</p>
          </div>
          <DownloadIcon />
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {media.map((media) => {
        return renderMedia(media)
      })}
    </div>
  )
}

const DownloadIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-download"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
)

export default MediaDisplay

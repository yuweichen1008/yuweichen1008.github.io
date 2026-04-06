// Renders a flat array of Notion block objects to JSX.
// Handles the blocks Yuwei will realistically use for casual journaling.

function RichText({ richText = [] }) {
  return (
    <>
      {richText.map((t, i) => {
        let node = t.plain_text
        const ann = t.annotations || {}
        if (ann.bold) node = <strong>{node}</strong>
        if (ann.italic) node = <em>{node}</em>
        if (ann.code) node = <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm">{node}</code>
        if (ann.strikethrough) node = <s>{node}</s>
        if (t.href) node = <a href={t.href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">{node}</a>
        return <span key={i}>{node}</span>
      })}
    </>
  )
}

export default function NotionRenderer({ blocks = [] }) {
  const rendered = []
  let listBuffer = []
  let listType = null

  function flushList() {
    if (!listBuffer.length) return
    const Tag = listType === 'numbered_list_item' ? 'ol' : 'ul'
    const cls = listType === 'numbered_list_item'
      ? 'list-decimal list-inside space-y-1 my-4 text-gray-700 dark:text-gray-300'
      : 'list-disc list-inside space-y-1 my-4 text-gray-700 dark:text-gray-300'
    rendered.push(
      <Tag key={`list-${rendered.length}`} className={cls}>
        {listBuffer.map((item, i) => (
          <li key={i}>
            <RichText richText={item} />
          </li>
        ))}
      </Tag>
    )
    listBuffer = []
    listType = null
  }

  blocks.forEach((block, i) => {
    const type = block.type
    const data = block[type]

    // Flush list if we hit a non-list block
    if (type !== 'bulleted_list_item' && type !== 'numbered_list_item') {
      flushList()
    }

    switch (type) {
      case 'paragraph':
        rendered.push(
          <p key={i} className="my-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <RichText richText={data?.rich_text} />
          </p>
        )
        break

      case 'heading_1':
        rendered.push(
          <h1 key={i} className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">
            <RichText richText={data?.rich_text} />
          </h1>
        )
        break

      case 'heading_2':
        rendered.push(
          <h2 key={i} className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100">
            <RichText richText={data?.rich_text} />
          </h2>
        )
        break

      case 'heading_3':
        rendered.push(
          <h3 key={i} className="text-xl font-semibold mt-5 mb-2 text-gray-900 dark:text-gray-100">
            <RichText richText={data?.rich_text} />
          </h3>
        )
        break

      case 'bulleted_list_item':
        if (listType !== 'bulleted_list_item') {
          flushList()
          listType = 'bulleted_list_item'
        }
        listBuffer.push(data?.rich_text || [])
        break

      case 'numbered_list_item':
        if (listType !== 'numbered_list_item') {
          flushList()
          listType = 'numbered_list_item'
        }
        listBuffer.push(data?.rich_text || [])
        break

      case 'quote':
        rendered.push(
          <blockquote
            key={i}
            className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic text-gray-600 dark:text-gray-400"
          >
            <RichText richText={data?.rich_text} />
          </blockquote>
        )
        break

      case 'divider':
        rendered.push(
          <hr key={i} className="my-8 border-gray-200 dark:border-gray-700" />
        )
        break

      case 'image': {
        const src = data?.external?.url || data?.file?.url || ''
        const caption = data?.caption?.map((c) => c.plain_text).join('') || ''
        if (src) {
          rendered.push(
            <figure key={i} className="my-6">
              <img
                src={src}
                alt={caption || 'image'}
                className="rounded-lg max-w-full"
              />
              {caption && (
                <figcaption className="text-sm text-center text-gray-400 mt-2">{caption}</figcaption>
              )}
            </figure>
          )
        }
        break
      }

      case 'callout':
        rendered.push(
          <div
            key={i}
            className="flex gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 my-4"
          >
            <span className="text-xl flex-shrink-0">{data?.icon?.emoji || 'ℹ️'}</span>
            <div className="text-gray-700 dark:text-gray-300">
              <RichText richText={data?.rich_text} />
            </div>
          </div>
        )
        break

      default:
        break
    }
  })

  flushList()

  return <div className="notion-content">{rendered}</div>
}

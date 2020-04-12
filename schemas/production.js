import PerformanceCalendar from "../components/PerformanceCalendar";

export default {
  type: "object",
  name: "production",
  title: "Production",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "crew",
      title: "Crew",
      type: "array",
      of: [{ type: "crewEntry" }]
    },
    {
      name: "mainImage",
      title: "Production cover image",
      type: "image",
      options: {
        hotspot: true
      }
    },
    {
      name: "images",
      title: "Production images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true
          }
        }
      ]
    },
    {
      name: "vimeoId",
      title: "Vimeo ID",
      description: "De 012345678 in https://vimeo.com/012345678",
      type: "string",
    },
    {
      name: "performanceCalendar",
      title: "Performance Calendar",
      type: "string",
      inputComponent: PerformanceCalendar,
    }
  ],
  preview: {
    select: {
      media: "mainImage",
      title: "title"
    },
    prepare(selection) {
      const { media, title } = selection;
      return {
        title,
        media
      };
    }
  }
};


/*
<iframe src="https://player.vimeo.com/video/396407429" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
<p><a href="https://vimeo.com/396407429">La Barraca speelt &quot;Ontijdeling&quot;</a> from <a href="https://vimeo.com/user20388824">La Barraca theater-op-schoot</a> on <a href="https://vimeo.com">Vimeo</a>.</p>
*/
BOT_NAME = 'franchiseball'

SPIDER_MODULES = ['franchiseball']
NEWSPIDER_MODULE = 'franchiseball'

ROBOTSTXT_OBEY = True
DOWNLOAD_DELAY = 1

CONCURRENT_REQUESTS = 16

ITEM_PIPELINES = {
  'franchiseball.pipelines.SaveTeamPipeline': 1,
  'franchiseball.pipelines.SavePlayerPipeline': 2,
}

DUPEFILTER_CLASS = 'scrapy.dupefilters.BaseDupeFilter'

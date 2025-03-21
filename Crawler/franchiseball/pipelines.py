import os
import pymongo
import pandas as pd

from dotenv import load_dotenv
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

class SaveTeamPipeline:
    def __init__(self):
        self.client = None
        self.db = None
        self.collection = None

    def open_spider(self, spider):
        try:
            self.client = pymongo.MongoClient(MONGO_URI)
            self.db = self.client["franchiseball"]
            self.collection = self.db["teams"]
            spider.logger.info("MongoDB connection opened.")
        except Exception as e:
            spider.logger.error(f"Error opening MongoDB connection: {e}")
            self.client = None

    def process_item(self, item, spider):
        spider.scraped_team_data.append(dict(item))

    def close_spider(self, spider):
        if self.client:
            if spider.scraped_team_data:
                for team in spider.scraped_team_data:
                    try:
                        team_dict = dict(team)
                        team_dict.pop('_id', None)

                        self.collection.insert_one(team_dict)
                        spider.logger.info(f"Inserted team: {team_dict.get('name', 'Unknown')}")
                    except Exception as e:
                        spider.logger.error(f"Error saving data to MongoDB: {e}")
            else:
                spider.logger.info("No team data to save.")
            
            self.client.close()
            spider.logger.info("MongoDB connection closed.")
        else:
            spider.logger.error("MongoDB connection was not opened.")
class SavePlayerPipeline:
    def __init__(self):
        self.client = None
        self.db = None
        self.collection = None

    def open_spider(self, spider):
        try:
            self.client = pymongo.MongoClient(MONGO_URI)
            self.db = self.client["franchiseball"]
            self.collection = self.db["players"]
            spider.logger.info("MongoDB connection opened.")
        except Exception as e:
            spider.logger.error(f"Error opening MongoDB connection: {e}")
            self.client = None

    def process_item(self, item, spider):
        spider.scraped_player_data.append(dict(item))

    def close_spider(self, spider):
        if self.client:
            if spider.scraped_player_data:
                for player in spider.scraped_player_data:
                    try:
                        player_dict = dict(player)
                        player_dict.pop('_id', None)

                        self.collection.insert_one(player_dict)
                        spider.logger.info(f"Inserted player: {player_dict.get('name', 'Unknown')}")
                    except Exception as e:
                        spider.logger.error(f"Error saving data to MongoDB: {e}")
            else:
                spider.logger.info("No player data to save.")
            
            self.client.close()
            spider.logger.info("MongoDB connection closed.")
        else:
            spider.logger.error("MongoDB connection was not opened.")
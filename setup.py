from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in portal/__init__.py
from portal import __version__ as version

setup(
	name="portal",
	version=version,
	description="Portal for Sales Persons and Customers",
	author="ParaLogic",
	author_email="info@paralogic.io",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)

COVERDIST = lib-cov
TIMEOUT = 10000
TEST = 	mocha
TESTDIRS = lib

.PHONY: clean test test-cov test-all

clean: 
	@echo "test clean"
	@rm -rf ./$(COVERDIST)

test:
	@$(TEST) --timeout=$(TIMEOUT) --compilers js:babel-core/register


test-cov:
	@istanbul cover _$(TEST) --timeout=$(TIMEOUT) --compilers --js:babel-core/register

joy:
	@echo "test joy do you like cheery pi"


test-all: test-cov






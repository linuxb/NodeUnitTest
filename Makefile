COVERDIST = lib-cov
TIMEOUT = 10000
TEST = 	mocha
TESTDIRS = lib

.PHONY: clean test test-cov test-all

clean: 
	@echo "test clean"
	@rm -rf ./$(COVERDIST)

test:
	@$(TEST) --timeout=$(TIMEOUT)


test-cov:
	@istanbul cover _$(TEST) --timeout=$(TIMEOUT)


test-all: test test-cov






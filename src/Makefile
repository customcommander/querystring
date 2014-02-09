# Default build target puts the library in the global namespace
# Adding support for @NAMESPACE@ token now as I'd like to be able
# to build the library under a custom namespace soon-ish.
build:
	@rm -f ../build/*
	@cat js/ns-intro.js js/qs.js js/ns-outro.js | sed 's/@NAMESPACE@/window/' >../build/qs.js
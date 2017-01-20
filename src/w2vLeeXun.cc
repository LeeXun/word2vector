// hello.cc
#include <node.h>
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <fstream>
#include <string.h>
#include <string>
#include <math.h>
#include <time.h>

size_t debug = 0;
const long long max_size = 10000;         // max length of strings
const long long N = 40;                  // number of closest words that will be shown
const long long max_w = 50;              // max length of vocabulary entries
namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

FILE *f;
char st1[max_size];
char line[max_size+max_size];
char *bestw[N];
char file_name[max_size], st[100][max_size];
float dist, len, bestd[N], vec[max_size];
long long words, size, a, b, c, d, cn, bi[100];
float *M;
char *vocab;
bool isModelSet = false;
time_t start;
struct tm tm;
double tick = -1;
char *tokens[max_size];

int split(char **tokens, char *str, const char *del) {
   char *s = strtok(str, del);
   int count = 0;
   while(s != NULL) {
     *tokens++ = s;
     s = strtok(NULL, del);
     count ++;
   }
   return count;
}

bool ConsoleTime(const char *event)
{
    time_t tmp = time(NULL);
    if(tick != (tmp - start))
    {
      printf("%s", event);
      printf("%.f seconds", difftime(tmp, start));
      tick = (tmp - start);
      return true;
    }
    return false;
}

void LoadModel(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  if(args.Length() < 1)
  {
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "LoadModel has no params.\n"));
    return;
  }
  char filename[max_size], fileType[max_size];
  strcpy(filename, *String::Utf8Value(args[0]->ToString()));
  strcpy(fileType, *String::Utf8Value(args[1]->ToString()));
  printf("Reading: %s ....\n\n", filename);
  start = time(NULL);
  f = fopen(filename, "rb");
  if (f == NULL) {
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Input file not found\n"));
    return;
  }
  fgets(line, max_size+max_size, f);
  split(tokens, line, " ");
  words = atof(tokens[0]);
  size = atof(tokens[1]);
  vocab = (char *)malloc((long long)words * max_w * sizeof(char));
  for (a = 0; a < N; a++) bestw[a] = (char *)malloc(max_size * sizeof(char));
  M = (float *)malloc((long long)words * (long long)size * sizeof(float));
  if (M == NULL) {
    printf("Cannot allocate memory: %lld MB    %lld  %lld\n", (long long)words * size * sizeof(float) / 1048576, words, size);
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Cannot allocate memory.\n"));
    return;
  }

  if(strcmp(fileType, "utf-8") == 0)
  {
    for (b = 0; b < words; b++) {
      fgets(line, max_size+max_size, f);
      split(tokens, line, " ");
      a = 0;
      while(tokens[0][a])
      {
        vocab[b * max_w + a] = tokens[0][a];
        // if(debug) printf("%c", vocab[b * max_w + a]);
        a ++;
      }
      vocab[b * max_w + a] = 0;
      // if(debug && ConsoleTime("")) printf(",%lld,%lld\n", b, size);
      for (a = 1; a < size+1; a++)
      {
        M[a + b * size] = atof(tokens[a]);
        // if(debug) printf(" %f", M[a + b * size]);
      }
      len = 0; // start of normalizing
      for (a = 0; a < size; a++) len += M[a + b * size] * M[a + b * size];
      len = sqrt(len);
      for (a = 0; a < size; a++) M[a + b * size] /= len; // end of normalizing
      // if(debug) printf("\n");
    }
  }
  else
  {
    for (b = 0; b < words; b++) {
      a = 0;
      while (1) {
        vocab[b * max_w + a] = fgetc(f);
        // printf("%c ", vocab[b * max_w + a]);
        if (feof(f) || (vocab[b * max_w + a] == ' ')) break;
        if ((a < max_w) && (vocab[b * max_w + a] != '\n')) a++;
      }
      vocab[b * max_w + a] = 0;
      for (a = 0; a < size; a++) fread(&M[a + b * size], sizeof(float), 1, f);
      len = 0;
      for (a = 0; a < size; a++) len += M[a + b * size] * M[a + b * size];
      // if(ConsoleTime("")) printf(",%lld,%lld\n", b, size);
      len = sqrt(len);
      for (a = 0; a < size; a++) M[a + b * size] /= len; // normalizing
    }
  }
  isModelSet = true;
  printf("Loaded: %s\n", filename);
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "true"));
}

void BinModel2TXT(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  if(args.Length() < 1)
  {
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "LoadModel has no params.\n"));
    return;
  }
  char filename[max_size];
  strcpy(filename, *String::Utf8Value(args[0]->ToString()));
  printf("Reading: %s ....\n\n", filename);
  start = time(NULL);
  f = fopen(filename, "rb");
  if (f == NULL) {
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Input file not found\n"));
    return;
  }
  FILE *fp = fopen("file.txt", "w");
  if (fp == NULL)
  {
      printf("Error opening file!\n");
      exit(1);
  }
  fgets(line, max_size+max_size, f);
  split(tokens, line, " ");
  words = atof(tokens[0]);
  size = atof(tokens[1]);
  fprintf(fp, "%lld ", words);
  fprintf(fp, "%lld\n", size);
  vocab = (char *)malloc((long long)words * max_w * sizeof(char));
  for (a = 0; a < N; a++) bestw[a] = (char *)malloc(max_size * sizeof(char));
  M = (float *)malloc((long long)words * (long long)size * sizeof(float));
  if (M == NULL) {
    printf("Cannot allocate memory: %lld MB    %lld  %lld\n", (long long)words * size * sizeof(float) / 1048576, words, size);
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Cannot allocate memory.\n"));
    return;
  }
  for (b = 0; b < words; b++) {
    a = 0;
    while (1) {
      vocab[b * max_w + a] = fgetc(f);
      // printf("%c ", vocab[b * max_w + a]);
      fprintf(fp, "%c", vocab[b * max_w + a]);
      if (feof(f) || (vocab[b * max_w + a] == ' ')) break;
      if ((a < max_w) && (vocab[b * max_w + a] != '\n')) a++;
    }
    vocab[b * max_w + a] = 0;
    for (a = 0; a < size; a++) fread(&M[a + b * size], sizeof(float), 1, f);
    len = 0;
    for (a = 0; a < size; a++) len += M[a + b * size] * M[a + b * size];
    // if(ConsoleTime("")) printf(",%lld,%lld\n", b, size);
    len = sqrt(len);
    for (a = 0; a < size; a++) M[a + b * size] /= len; // normalizing
    for (a = 0; a < size; a++) fprintf(fp, "%f ", M[a + b * size]);
  }
  fclose(fp);
  printf("Loaded: %s\n", filename);
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "true"));
}

void GetVectors(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  if(args.Length() < 1)
  {
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "GetVector has no params.\n"));
    return;
  }
  if(!isModelSet)
  {
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Model is not set.\n"));
    return;
  }
  char paraWords[max_size];
  strcpy(paraWords, *String::Utf8Value(args[0]->ToString()));
  std::string result = "";
  int wordC = 0;
  char *tokens[max_size];
  int wordsSize = split(tokens, paraWords, ",");
  while(wordC < wordsSize){
    result += tokens[wordC];
    result += ',';
    strcpy(st1, tokens[wordC]);
    if(strlen(st1) > max_size-1)
    {
      args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Word size is too large.\n"));
      return;
    }
    cn = 0;
    b = 0;
    c = 0;
    while (1) {
      st[cn][b] = st1[c];
      b++;
      c++;
      st[cn][b] = 0;
      if (st1[c] == 0) break;
      if (st1[c] == ' ') {
        cn++;
        b = 0;
        c++;
      }
    }
    cn++;
    for (a = 0; a < cn; a++) {
      for (b = 0; b < words; b++) if (!strcmp(&vocab[b * max_w], st[a])) break;
      if (b == words) b = -1;
      bi[a] = b;
      // printf("%f\n", M[a + bi[a] * size]);
      // printf("\nWord: %s  Position in vocabulary: %lld\n", st[a], bi[a]);
      if (b == -1) {
        result += "Out of dictionary word";
      }
    }
    if(b != -1)
    {
      for (a = 0; a < size; a++) vec[a] = 0;
      for (b = 0; b < cn; b++) {
        if (bi[b] == -1) continue;
        for (a = 0; a < size; a++) vec[a] += M[a + bi[b] * size];
      }
      for(a = 0; a < size; a++)
      {
        if(a == 0) result += std::to_string(vec[a]);
        else
        {
          result += ',' ;
          result += std::to_string(vec[a]);
        }
      }
    }
    result += "\n";
    wordC ++; // next word
  }
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, result.c_str()));
}

void GetSimilarWords(const FunctionCallbackInfo<Value>& args)
{
  Isolate* isolate = args.GetIsolate();
  if(args.Length() < 1)
  {
    printf("GetSimilarWords has no params.\n");
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "false"));
    return;
  }
  if(!isModelSet)
  {
    printf("Model is not set.\n");
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "false"));
    return;
  }
  strcpy(st1, *String::Utf8Value(args[0]->ToString()));
  for (a = 0; a < N; a++) bestd[a] = 0;
  for (a = 0; a < N; a++) bestw[a][0] = 0;
  if(strlen(st1) > max_size-1)
  {
    printf("Word byte is too large.\n");
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "false"));
    return;
  }
  cn = 0;
  b = 0;
  c = 0;
  while (1) {
    st[cn][b] = st1[c];
    b++;
    c++;
    st[cn][b] = 0;
    if (st1[c] == 0) break;
    if (st1[c] == ' ') {
      cn++;
      b = 0;
      c++;
    }
  }
  cn++;
  for (a = 0; a < cn; a++) {
    for (b = 0; b < words; b++) if (!strcmp(&vocab[b * max_w], st[a])) break;
    if (b == words) b = -1;
    bi[a] = b;
    // printf("\nWord: %s  Position in vocabulary: %lld\n", st[a], bi[a]);
    if (b == -1) {
      printf("%s Out of dictionary word.", st[a]);
      args.GetReturnValue().Set(String::NewFromUtf8(isolate, "false"));
      return;
    }
  }
  for (a = 0; a < size; a++) vec[a] = 0;
  for (b = 0; b < cn; b++) {
    if (bi[b] == -1) continue;
    for (a = 0; a < size; a++) vec[a] += M[a + bi[b] * size];
  }
  len = 0;
  for (a = 0; a < size; a++) len += vec[a] * vec[a];
  len = sqrt(len);
  for (a = 0; a < size; a++) vec[a] /= len;
  for (a = 0; a < N; a++) bestd[a] = -1;
  for (a = 0; a < N; a++) bestw[a][0] = 0;
  for (c = 0; c < words; c++) {
    a = 0;
    for (b = 0; b < cn; b++) if (bi[b] == c) a = 1;
    if (a == 1) continue;
    dist = 0;
    for (a = 0; a < size; a++) dist += vec[a] * M[a + c * size];
    for (a = 0; a < N; a++) {
      if (dist > bestd[a]) {
        for (d = N - 1; d > a; d--) {
          bestd[d] = bestd[d - 1];
          strcpy(bestw[d], bestw[d - 1]);
        }
        bestd[a] = dist;
        strcpy(bestw[a], &vocab[c * max_w]);
        break;
      }
    }
  }
  std::string result = "";
  for (a = 0; a < N; a++)
  {
    // printf("%s,%f\n", bestw[a], bestd[a]);
    result += bestw[a];
    result += ',';
    result += std::to_string(bestd[a]);
    if(a < N-1)
    {
      result += '\n';
    }
  }
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, result.c_str()));
  return;
}
void GetNeighbors(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  if(args.Length() < 1)
  {
    printf("GetNeighbors has no params.\n");
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "false"));
    return;
  }
  if(!isModelSet)
  {
    printf("Model is not set.\n");
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "false"));
    return;
  }
  char paraWords[max_size];
  strcpy(paraWords, *String::Utf8Value(args[0]->ToString()));
  for (a = 0; a < N; a++) bestd[a] = 0;
  for (a = 0; a < N; a++) bestw[a][0] = 0;
  char *tokens[max_size];
  split(tokens, paraWords, ",");
  for (a = 0; a < size; a++)
  {
    vec[a] = atof(tokens[a]);
  }
  cn = 1;
  b = 0;
  c = 0;
  len = 0;
  for (a = 0; a < size; a++) len += vec[a] * vec[a];
  len = sqrt(len);
  for (a = 0; a < size; a++) vec[a] /= len;
  for (a = 0; a < N; a++) bestd[a] = -1;
  for (a = 0; a < N; a++) bestw[a][0] = 0;
  for (c = 0; c < words; c++) {
    a = 0;
    for (b = 0; b < cn; b++) if (bi[b] == c) a = 1;
    if (a == 1) continue;
    dist = 0;
    for (a = 0; a < size; a++) dist += vec[a] * M[a + c * size];
    for (a = 0; a < N; a++) {
      if (dist > bestd[a]) {
        for (d = N - 1; d > a; d--) {
          bestd[d] = bestd[d - 1];
          strcpy(bestw[d], bestw[d - 1]);
        }
        bestd[a] = dist;
        strcpy(bestw[a], &vocab[c * max_w]);
        break;
      }
    }
  }
  std::string result = "";
  for (a = 0; a < N; a++)
  {
    // printf("%s,%f\n", bestw[a], bestd[a]);
    result += bestw[a];
    result += ',';
    result += std::to_string(bestd[a]);
    result += '\n';
  }
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, result.c_str()));
  return;
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "Load", LoadModel);
  NODE_SET_METHOD(exports, "GetVectors", GetVectors);
  NODE_SET_METHOD(exports, "GetSimilarWords", GetSimilarWords);
  NODE_SET_METHOD(exports, "GetNeighbors", GetNeighbors);
  NODE_SET_METHOD(exports, "BinModel2TXT", BinModel2TXT);
}

NODE_MODULE(w2vLeeXun, init)
}  // namespace demo
